import React, { useState, useMemo } from 'react';
import { 
    Lightbulb, Calculator, TrendingUp, AlertTriangle, RefreshCw, Sparkles, 
    ChevronLeft, X, CheckCircle, ChevronUp, ChevronDown, Star, Banknote, 
    HelpCircle, ArrowUpDown, Filter, BarChart3, PieChart as PieChartIcon, 
    BookOpen, Layers, DollarSign, Check, Info, FileSpreadsheet
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProducts, getAllCategories, updateProduct } from '../../services/inventoryService';
import { generateMenuEngineeringStrategy } from '../../services/aiService';
import { Product, ProductCategory, ViewState } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { db } from '../../db';
import Markdown from 'react-markdown';
import { 
    ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
    Tooltip, CartesianGrid, ReferenceLine, Cell, BarChart, Bar, Legend
} from 'recharts';

interface Props {
    onNavigate: (view: ViewState) => void;
}

type TabType = 'bcg' | 'recipes' | 'pricing' | 'simulator';
type TimeFilter = '7d' | '30d' | '90d' | 'all';

interface ProductBCGData {
    id: string;
    name: string;
    category_id: string;
    category_name: string;
    is_compound: boolean;
    cost: number;
    selling_price: number;
    margin: number;
    margin_percent: number;
    food_cost: number;
    quantity_sold: number;
    total_revenue: number;
    total_profit: number;
    category_bcg: 'Estrella' | 'Vaca' | 'Interrogante' | 'Perro';
}

export const MenuEngineeringScreen: React.FC<Props> = ({ onNavigate }) => {
    const queryClient = useQueryClient();
    
    // Primary Tab Navigation
    const [activeTab, setActiveTab] = useState<TabType>('bcg');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [targetMargin, setTargetMargin] = useState<number>(70);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiReport, setAiReport] = useState<string | null>(null);
    const [isConfirmingMassPrice, setIsConfirmingMassPrice] = useState(false);
    const [notification, setNotification] = useState<{title: string, message: string, type: 'success' | 'error'} | null>(null);
    
    // Interactive Simulator State
    const [selectedProductToSimulate, setSelectedProductToSimulate] = useState<string | null>(null);
    const [simulatedPrice, setSimulatedPrice] = useState<number>(0);
    const [simulatedCost, setSimulatedCost] = useState<number>(0);

    // Fetch Products & Categories
    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories
    });

    // Fetch Historical Sales from Local Dexie Orders for BCG Matrix
    const { data: salesStats = { itemsSold: new Map<string, number>(), totalRevenue: 0 }, isLoading: isLoadingSales } = useQuery({
        queryKey: ['menu-sales-stats', timeFilter],
        queryFn: async () => {
            const now = new Date();
            const filterDate = new Date();
            if (timeFilter === '7d') filterDate.setDate(now.getDate() - 7);
            else if (timeFilter === '30d') filterDate.setDate(now.getDate() - 30);
            else if (timeFilter === '90d') filterDate.setDate(now.getDate() - 90);
            else filterDate.setFullYear(2000); // all time

            const orders = await db.orders
                .filter(o => {
                    const d = new Date(o.closed_at || o.created_at);
                    return d >= filterDate && (o.status === 'paid');
                })
                .toArray();

            const itemsMap = new Map<string, number>();
            let rev = 0;

            orders.forEach(order => {
                rev += (order.total || 0);
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach((item: any) => {
                        const pid = item.product_id;
                        if (pid) {
                            const curr = itemsMap.get(pid) || 0;
                            itemsMap.set(pid, curr + (item.quantity || 1));
                        }
                    });
                }
            });

            return { itemsSold: itemsMap, totalRevenue: rev };
        }
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Product> }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });

    // Category Map for fast lookup
    const categoryMap = useMemo(() => {
        return new Map(categories.map(c => [c.id, c.name]));
    }, [categories]);

    // Calculate actual costs for compound products
    const productsWithCalculatedCosts = useMemo(() => {
        return products.map(product => {
            if (product.is_compound && product.ingredients && product.ingredients.length > 0) {
                const calculatedCost = product.ingredients.reduce((acc, ing) => {
                    const child = products.find(p => p.id === ing.child_product_id);
                    const cost = child ? child.cost_price : 0;
                    const yieldPct = ing.yield_percentage || 100;
                    return acc + ((cost * ing.quantity) / (yieldPct / 100));
                }, 0);
                return { ...product, calculated_cost: calculatedCost };
            }
            return { ...product, calculated_cost: product.cost_price || 0 };
        });
    }, [products]);

    // Compute BCG Matrix Metrics (Popularity vs Profitability)
    const bcgData = useMemo<ProductBCGData[]>(() => {
        const items = productsWithCalculatedCosts.map(p => {
            const cost = p.calculated_cost || 0;
            const pvp = p.selling_price || 0;
            const margin = pvp - cost;
            const margin_percent = pvp > 0 ? ((pvp - cost) / pvp) * 100 : 0;
            const food_cost = pvp > 0 ? (cost / pvp) * 100 : 0;
            const quantity_sold = salesStats.itemsSold.get(p.id) || 0;
            const total_revenue = quantity_sold * pvp;
            const total_profit = quantity_sold * margin;

            return {
                id: p.id,
                name: p.name,
                category_id: p.category_id,
                category_name: categoryMap.get(p.category_id) || 'Sin Categoría',
                is_compound: !!p.is_compound,
                cost,
                selling_price: pvp,
                margin,
                margin_percent,
                food_cost,
                quantity_sold,
                total_revenue,
                total_profit,
                category_bcg: 'Perro' as const
            };
        });

        // Filter by category and search if necessary
        const relevant = items.filter(p => {
            if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
            if (searchTerm.trim() && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });

        if (relevant.length === 0) return [];

        // Threshold calculations: Average Units Sold and Average Unit Margin
        const totalUnits = relevant.reduce((sum, item) => sum + item.quantity_sold, 0);
        const totalMarginSum = relevant.reduce((sum, item) => sum + item.margin, 0);

        // If no sales exist yet in database, fall back to a baseline so user can explore
        const avgUnits = totalUnits > 0 ? (totalUnits / relevant.length) : 0;
        const avgMargin = relevant.length > 0 ? (totalMarginSum / relevant.length) : 0;

        return relevant.map(item => {
            let cat: 'Estrella' | 'Vaca' | 'Interrogante' | 'Perro' = 'Perro';
            if (item.quantity_sold >= avgUnits && item.margin >= avgMargin) {
                cat = 'Estrella';
            } else if (item.quantity_sold >= avgUnits && item.margin < avgMargin) {
                cat = 'Vaca';
            } else if (item.quantity_sold < avgUnits && item.margin >= avgMargin) {
                cat = 'Interrogante';
            } else {
                cat = 'Perro';
            }
            return { ...item, category_bcg: cat };
        }).sort((a, b) => b.total_profit - a.total_profit);
    }, [productsWithCalculatedCosts, salesStats, selectedCategory, searchTerm, categoryMap]);

    // Averages for Reference Lines in BCG Chart
    const { avgUnitsThreshold, avgMarginThreshold } = useMemo(() => {
        if (bcgData.length === 0) return { avgUnitsThreshold: 0, avgMarginThreshold: 0 };
        const totalUnits = bcgData.reduce((s, i) => s + i.quantity_sold, 0);
        const totalMargin = bcgData.reduce((s, i) => s + i.margin, 0);
        return {
            avgUnitsThreshold: Math.round((totalUnits / bcgData.length) * 10) / 10,
            avgMarginThreshold: Math.round((totalMargin / bcgData.length) * 100) / 100
        };
    }, [bcgData]);

    // Products filtered for the Mass Pricing & Recipes tables
    const filteredProducts = useMemo(() => {
        return productsWithCalculatedCosts.filter(p => {
            if (selectedCategory !== 'all' && p.category_id !== selectedCategory) return false;
            if (searchTerm.trim() && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [productsWithCalculatedCosts, selectedCategory, searchTerm]);

    // Active product for simulator
    const activeProductToSimulate = useMemo(() => {
        if (!selectedProductToSimulate) {
            return bcgData[0] || null;
        }
        return bcgData.find(p => p.id === selectedProductToSimulate) || bcgData[0] || null;
    }, [selectedProductToSimulate, bcgData]);

    // Initialize simulator price and cost when active product changes
    React.useEffect(() => {
        if (activeProductToSimulate) {
            setSimulatedPrice(activeProductToSimulate.selling_price);
            setSimulatedCost(activeProductToSimulate.cost);
        }
    }, [activeProductToSimulate?.id]);

    const executeMassPricing = async () => {
        setIsConfirmingMassPrice(false);
        setIsCalculating(true);
        try {
            let updatedCount = 0;
            for (const product of filteredProducts) {
                const cost = product.calculated_cost || 0;
                if (cost > 0) {
                    const newPvp = cost / (1 - (targetMargin / 100));
                    const roundedPvp = Math.ceil(newPvp * 10) / 10; 
                    
                    if (Math.abs(roundedPvp - product.selling_price) > 0.01) {
                        await updateProductMutation.mutateAsync({
                            id: product.id,
                            data: { selling_price: roundedPvp }
                        });
                        updatedCount++;
                    }
                }
            }
            setNotification({
                title: "Precios Actualizados",
                message: `Se han recalculado y fijado los precios de ${updatedCount} productos para garantizar un margen del ${targetMargin}%.`,
                type: 'success'
            });
        } catch (error) {
            console.error("Error updating prices:", error);
            setNotification({
                title: "Error",
                message: "Hubo un error al actualizar los precios.",
                type: 'error'
            });
        } finally {
            setIsCalculating(false);
        }
    };

    const handleGenerateAI = async () => {
        setIsGeneratingAI(true);
        try {
            const dataToAnalyze = bcgData.map(p => ({
                nombre: p.name,
                categoria: p.category_name,
                es_receta_compuesta: p.is_compound,
                coste_materia_prima: p.cost,
                precio_venta: p.selling_price,
                margen_unitario_euros: p.margin,
                margen_bruto_pct: p.margin_percent,
                food_cost_pct: p.food_cost,
                unidades_vendidas_periodo: p.quantity_sold,
                clasificacion_bcg: p.category_bcg,
                beneficio_total_generado: p.total_profit
            }));
            
            if (dataToAnalyze.length === 0) {
                setNotification({
                    title: "Sin datos",
                    message: "No hay productos en esta selección para analizar.",
                    type: 'error'
                });
                setIsGeneratingAI(false);
                return;
            }

            const report = await generateMenuEngineeringStrategy(dataToAnalyze);
            setAiReport(report);
        } catch (error: any) {
            setNotification({
                title: "Error Asesor IA",
                message: error.message || "Error al generar el informe con Gemini.",
                type: 'error'
            });
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // Helper color classes for BCG classification
    const getBCGColor = (category: string) => {
        switch (category) {
            case 'Estrella': return {
                badge: 'bg-yellow-400/20 text-yellow-400 border-yellow-500/40',
                border: 'border-yellow-500/30',
                text: 'text-yellow-400',
                fill: '#facc15'
            };
            case 'Vaca': return {
                badge: 'bg-blue-400/20 text-blue-400 border-blue-500/40',
                border: 'border-blue-500/30',
                text: 'text-blue-400',
                fill: '#60a5fa'
            };
            case 'Interrogante': return {
                badge: 'bg-purple-400/20 text-purple-400 border-purple-500/40',
                border: 'border-purple-500/30',
                text: 'text-purple-400',
                fill: '#c084fc'
            };
            case 'Perro': default: return {
                badge: 'bg-red-400/20 text-red-400 border-red-500/40',
                border: 'border-red-500/30',
                text: 'text-red-400',
                fill: '#f87171'
            };
        }
    };

    return (
        <div className="flex flex-col h-full bg-brand-900 text-white animate-in fade-in select-none">
            {/* Top Navigation Header */}
            <header className="bg-brand-800 p-4 border-b border-brand-700 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="w-12 h-12 bg-brand-700 rounded-xl flex items-center justify-center text-white hover:bg-brand-600 transition-colors shadow-md active:scale-95"
                        title="Volver al menú principal"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-yellow-500/20 border border-yellow-500/40 rounded-lg text-yellow-400">
                                <Lightbulb size={22} />
                            </span>
                            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                                Ingeniería de Menú
                            </h1>
                            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-700 border border-brand-600 text-gray-300">
                                Rentabilidad & Matriz BCG
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                            Cruza costes de escandallo con ventas reales del TPV y optimiza la carta con el Asesor IA.
                        </p>
                    </div>
                </div>

                {/* Main Tab Controls */}
                <div className="flex items-center gap-1.5 bg-brand-900 p-1.5 rounded-xl border border-brand-700 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('bcg')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === 'bcg'
                                ? 'bg-brand-accent text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-brand-800'
                        }`}
                    >
                        <Star size={16} />
                        <span>Matriz BCG</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('recipes')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === 'recipes'
                                ? 'bg-brand-accent text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-brand-800'
                        }`}
                    >
                        <AlertTriangle size={16} />
                        <span>Análisis Food Cost</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === 'pricing'
                                ? 'bg-brand-accent text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-brand-800'
                        }`}
                    >
                        <Calculator size={16} />
                        <span>Cálculo Masivo PVP</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('simulator')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === 'simulator'
                                ? 'bg-brand-accent text-white shadow-md'
                                : 'text-gray-400 hover:text-white hover:bg-brand-800'
                        }`}
                    >
                        <TrendingUp size={16} />
                        <span>Simulador What-If</span>
                    </button>
                </div>
            </header>

            {/* Subheader Filters (Category, Time Window, Search, AI Action) */}
            <div className="bg-brand-800/60 px-4 py-3 border-b border-brand-700/80 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Time Window Filter (for BCG calculations) */}
                    <div className="flex items-center bg-brand-900 border border-brand-700 rounded-lg p-1">
                        {(['7d', '30d', '90d', 'all'] as TimeFilter[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setTimeFilter(t)}
                                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                                    timeFilter === t
                                        ? 'bg-brand-700 text-white font-bold'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                {t === '7d' ? '7 días' : t === '30d' ? '30 días' : t === '90d' ? '90 días' : 'Todo'}
                            </button>
                        ))}
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-1.5">
                        <Filter size={14} className="text-gray-400" />
                        <select 
                            className="bg-brand-900 border border-brand-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-brand-accent text-xs md:text-sm"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">Todas las familias</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Field */}
                    <input 
                        type="text"
                        placeholder="Buscar plato o bebida..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-brand-900 border border-brand-700 rounded-lg px-3 py-1.5 text-white placeholder-gray-500 outline-none focus:border-brand-accent text-xs md:text-sm w-44 md:w-56"
                    />
                </div>

                {/* Asesor IA Trigger Button */}
                <button 
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI || bcgData.length === 0}
                    className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-brand-950 font-black px-4 py-2 rounded-xl text-xs md:text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer ml-auto"
                >
                    {isGeneratingAI ? <RefreshCw className="animate-spin text-brand-950" size={16} /> : <Sparkles size={16} />}
                    <span>{isGeneratingAI ? 'Analizando con IA...' : 'Generar Informe Estratégico IA'}</span>
                </button>
            </div>

            {/* Main Content Area by Tab */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
                {/* ========================================================================= */}
                {/* TAB 1: MATRIZ BCG (POPULARIDAD VS RENTABILIDAD) */}
                {/* ========================================================================= */}
                {activeTab === 'bcg' && (
                    <div className="space-y-6">
                        {/* 4 BCG Quadrant KPI Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Estrellas */}
                            <div className="bg-brand-800/90 rounded-2xl border border-yellow-500/40 p-4 shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-yellow-400 font-bold text-base">
                                            <Star size={20} className="fill-current" />
                                            <span>Estrellas</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                                            {bcgData.filter(p => p.category_bcg === 'Estrella').length} platos
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300">
                                        Alta Popularidad + Alto Margen. Son tus joyas; mantén la receta y destácalos en sala.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-brand-700/60 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Beneficio Total:</span>
                                    <span className="font-mono font-bold text-yellow-400">
                                        {formatCurrency(bcgData.filter(p => p.category_bcg === 'Estrella').reduce((s, p) => s + p.total_profit, 0))}
                                    </span>
                                </div>
                            </div>

                            {/* Vacas */}
                            <div className="bg-brand-800/90 rounded-2xl border border-blue-500/40 p-4 shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-blue-400 font-bold text-base">
                                            <Banknote size={20} />
                                            <span>Vacas Lecheras</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-400/20 text-blue-400 border border-blue-400/30">
                                            {bcgData.filter(p => p.category_bcg === 'Vaca').length} platos
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300">
                                        Alta Popularidad + Bajo Margen. Clásicos del cliente; intenta rebajar costes con proveedores o subir 0,30€.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-brand-700/60 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Beneficio Total:</span>
                                    <span className="font-mono font-bold text-blue-400">
                                        {formatCurrency(bcgData.filter(p => p.category_bcg === 'Vaca').reduce((s, p) => s + p.total_profit, 0))}
                                    </span>
                                </div>
                            </div>

                            {/* Interrogantes */}
                            <div className="bg-brand-800/90 rounded-2xl border border-purple-500/40 p-4 shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
                                            <HelpCircle size={20} />
                                            <span>Interrogantes</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-400/20 text-purple-400 border border-purple-400/30">
                                            {bcgData.filter(p => p.category_bcg === 'Interrogante').length} platos
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300">
                                        Baja Popularidad + Alto Margen. Muy rentables pero poco pedidos; dales visibilidad mediante sugerencias del día.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-brand-700/60 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Beneficio Total:</span>
                                    <span className="font-mono font-bold text-purple-400">
                                        {formatCurrency(bcgData.filter(p => p.category_bcg === 'Interrogante').reduce((s, p) => s + p.total_profit, 0))}
                                    </span>
                                </div>
                            </div>

                            {/* Perros */}
                            <div className="bg-brand-800/90 rounded-2xl border border-red-500/40 p-4 shadow-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                                            <AlertTriangle size={20} />
                                            <span>Perros</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-400/20 text-red-400 border border-red-400/30">
                                            {bcgData.filter(p => p.category_bcg === 'Perro').length} platos
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300">
                                        Baja Popularidad + Bajo Margen. Ocupan stock y aportan poco margen; rediséñalos o retíralos de la carta.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-brand-700/60 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Beneficio Total:</span>
                                    <span className="font-mono font-bold text-red-400">
                                        {formatCurrency(bcgData.filter(p => p.category_bcg === 'Perro').reduce((s, p) => s + p.total_profit, 0))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Recharts Scatter Matrix */}
                        <div className="bg-brand-800 rounded-2xl border border-brand-700 p-5 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-brand-700 gap-2">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                                        <BarChart3 className="text-brand-accent" size={20} />
                                        Dispersión Visual de Platos (Matriz BCG Cuadrantes)
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Eje X: Cantidad de Unidades Vendidas | Eje Y: Margen Unitario (€) | Umbrales medios marcados con líneas punteadas.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> Estrellas</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span> Vacas</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-400 inline-block"></span> Interrogantes</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span> Perros</span>
                                </div>
                            </div>

                            <div className="h-[340px] w-full">
                                {bcgData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.6} />
                                            <XAxis 
                                                type="number" 
                                                dataKey="quantity_sold" 
                                                name="Unidades Vendidas" 
                                                stroke="#9ca3af" 
                                                fontSize={12}
                                                label={{ value: 'Unidades Vendidas (Popularidad)', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 12 }}
                                            />
                                            <YAxis 
                                                type="number" 
                                                dataKey="margin" 
                                                name="Margen Unitario" 
                                                stroke="#9ca3af" 
                                                fontSize={12}
                                                tickFormatter={(v) => `${v.toFixed(1)}€`}
                                                label={{ value: 'Margen (€)', angle: -90, position: 'insideLeft', offset: 0, fill: '#9ca3af', fontSize: 12 }}
                                            />
                                            <ZAxis range={[90, 160]} />
                                            {/* Reference lines dividing the 4 quadrants */}
                                            <ReferenceLine x={avgUnitsThreshold} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: `Media Unidades: ${avgUnitsThreshold}`, fill: '#f59e0b', fontSize: 11, position: 'insideTopRight' }} />
                                            <ReferenceLine y={avgMarginThreshold} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: `Media Margen: ${avgMarginThreshold}€`, fill: '#f59e0b', fontSize: 11, position: 'insideTopLeft' }} />
                                            <Tooltip 
                                                cursor={{ strokeDasharray: '3 3' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload as ProductBCGData;
                                                        const colors = getBCGColor(data.category_bcg);
                                                        return (
                                                            <div className="bg-brand-900 border border-brand-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 z-50">
                                                                <p className="font-bold text-white text-sm">{data.name}</p>
                                                                <p className="text-gray-400">{data.category_name}</p>
                                                                <div className="pt-1 flex items-center gap-1.5">
                                                                    <span className={`px-2 py-0.5 rounded font-bold border ${colors.badge}`}>
                                                                        {data.category_bcg}
                                                                    </span>
                                                                </div>
                                                                <div className="pt-2 border-t border-brand-800 space-y-0.5 font-mono">
                                                                    <p className="text-gray-300">PVP: <strong className="text-white">{formatCurrency(data.selling_price)}</strong></p>
                                                                    <p className="text-gray-300">Coste: <strong className="text-white">{formatCurrency(data.cost)}</strong></p>
                                                                    <p className="text-gray-300">Margen Unitario: <strong className="text-green-400">{formatCurrency(data.margin)}</strong> ({data.margin_percent.toFixed(1)}%)</p>
                                                                    <p className="text-gray-300">Vendidos en periodo: <strong className="text-yellow-400">{data.quantity_sold} u.</strong></p>
                                                                    <p className="text-gray-300">Beneficio Total: <strong className="text-brand-accent">{formatCurrency(data.total_profit)}</strong></p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Scatter name="Platos" data={bcgData}>
                                                {bcgData.map((entry, index) => {
                                                    const col = getBCGColor(entry.category_bcg);
                                                    return <Cell key={`cell-${index}`} fill={col.fill} stroke="#111827" strokeWidth={2} />;
                                                })}
                                            </Scatter>
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500">
                                        No hay datos disponibles para mostrar en la gráfica
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detailed Table for BCG Matrix */}
                        <div className="bg-brand-800 rounded-2xl border border-brand-700 shadow-lg overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-brand-700 flex justify-between items-center bg-brand-800/80">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <Star size={18} className="text-yellow-400" />
                                    <span>Clasificación Detallada del Catálogo ({bcgData.length} referencias)</span>
                                </h3>
                                <span className="text-xs text-gray-400">
                                    Haz clic en cualquier fila para abrir el simulador de rentabilidad
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs md:text-sm">
                                    <thead className="bg-brand-900/80 sticky top-0 z-10 border-b border-brand-700">
                                        <tr>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider">Producto / Plato</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider">Familia</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider text-right">Coste</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider text-right">PVP</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider text-right">Margen (€)</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider text-right">Food Cost %</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider text-right">Ventas ({timeFilter})</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider text-right">Ganancia Bruta</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase tracking-wider text-center">Cuadrante BCG</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-700/50">
                                        {bcgData.map(item => {
                                            const colors = getBCGColor(item.category_bcg);
                                            return (
                                                <tr 
                                                    key={item.id}
                                                    onClick={() => {
                                                        setSelectedProductToSimulate(item.id);
                                                        setActiveTab('simulator');
                                                    }}
                                                    className="hover:bg-brand-700/30 transition-colors cursor-pointer"
                                                    title="Haz clic para simular escenarios de precio"
                                                >
                                                    <td className="p-3 font-semibold text-white">
                                                        <div className="flex items-center gap-2">
                                                            {item.is_compound && (
                                                                <span className="w-2 h-2 rounded-full bg-orange-400" title="Receta Compuesta (Escandallo)" />
                                                            )}
                                                            <span>{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-gray-400">{item.category_name}</td>
                                                    <td className="p-3 text-right font-mono text-gray-300">{formatCurrency(item.cost)}</td>
                                                    <td className="p-3 text-right font-mono font-bold text-white">{formatCurrency(item.selling_price)}</td>
                                                    <td className="p-3 text-right font-mono font-bold text-green-400">{formatCurrency(item.margin)}</td>
                                                    <td className={`p-3 text-right font-mono font-bold ${
                                                        item.food_cost > 35 ? 'text-red-400' : item.food_cost > 28 ? 'text-yellow-400' : 'text-green-400'
                                                    }`}>
                                                        {item.food_cost.toFixed(1).replace('.', ',')}%
                                                    </td>
                                                    <td className="p-3 text-right font-mono text-yellow-300 font-bold">{item.quantity_sold} u.</td>
                                                    <td className="p-3 text-right font-mono text-brand-accent font-black">{formatCurrency(item.total_profit)}</td>
                                                    <td className="p-3 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors.badge}`}>
                                                            {item.category_bcg}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {bcgData.length === 0 && (
                                            <tr>
                                                <td colSpan={9} className="p-8 text-center text-gray-500">
                                                    No se encontraron productos con los filtros actuales.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 2: ANÁLISIS DE FOOD COST (RECETAS Y ESCANDALLOS) */}
                {/* ========================================================================= */}
                {activeTab === 'recipes' && (
                    <div className="space-y-6">
                        <div className="bg-brand-800 rounded-2xl border border-brand-700 p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                    <AlertTriangle className="text-orange-400" size={22} />
                                    Análisis de Food Cost en Recetas Compuestas
                                </h2>
                                <p className="text-gray-300 text-xs sm:text-sm mt-1">
                                    Calculado en base a los ingredientes escandallados en inventario, ponderando mermas y factor de rendimiento.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-xs bg-brand-900 p-2.5 rounded-xl border border-brand-700">
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-400"></span> Óptimo (&lt;28%)</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Ajustado (28-35%)</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Peligro (&gt;35%)</span>
                            </div>
                        </div>

                        <div className="bg-brand-800 rounded-2xl border border-brand-700 shadow-lg overflow-hidden flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs md:text-sm">
                                    <thead className="bg-brand-900/80 sticky top-0 z-10 border-b border-brand-700">
                                        <tr>
                                            <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Producto (Receta)</th>
                                            <th className="p-4 font-bold text-gray-400 uppercase tracking-wider">Familia</th>
                                            <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-right">Coste Materia Prima</th>
                                            <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-right">PVP Actual</th>
                                            <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-right">Margen Bruto (€)</th>
                                            <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-right">Margen (%)</th>
                                            <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-right">Food Cost (%)</th>
                                            <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-center">Diagnóstico</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-700/50">
                                        {filteredProducts.filter(p => p.is_compound).map(product => {
                                            const cost = product.calculated_cost || 0;
                                            const pvp = product.selling_price || 0;
                                            const margin = pvp - cost;
                                            const marginPct = pvp > 0 ? ((pvp - cost) / pvp) * 100 : 0;
                                            const foodCost = pvp > 0 ? (cost / pvp) * 100 : 0;
                                            
                                            let statusColor = "text-green-400";
                                            let statusBadge = "bg-green-400/10 text-green-400 border-green-400/20";
                                            let statusText = "Óptimo";
                                            let statusTooltip = "Rentabilidad ideal. Coste de materia prima bajo control (< 28%).";
                                            if (foodCost > 35) {
                                                statusColor = "text-red-400";
                                                statusBadge = "bg-red-400/10 text-red-400 border-red-400/20";
                                                statusText = "Peligro";
                                                statusTooltip = "Baja rentabilidad. Urge ajustar el escandallo o subir el PVP (> 35%).";
                                            } else if (foodCost > 28) {
                                                statusColor = "text-yellow-400";
                                                statusBadge = "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
                                                statusText = "Revisar";
                                                statusTooltip = "Margen ajustado. Considera revisar porciones o precio (28% - 35%).";
                                            }

                                            return (
                                                <tr 
                                                    key={product.id}
                                                    onClick={() => {
                                                        setSelectedProductToSimulate(product.id);
                                                        setActiveTab('simulator');
                                                    }}
                                                    className="hover:bg-brand-700/30 transition-colors cursor-pointer"
                                                >
                                                    <td className="p-4 font-bold text-white flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
                                                        <span>{product.name}</span>
                                                    </td>
                                                    <td className="p-4 text-gray-400">{categoryMap.get(product.category_id) || 'Sin Categoría'}</td>
                                                    <td className="p-4 text-right font-mono text-gray-300">{formatCurrency(cost)}</td>
                                                    <td className="p-4 text-right font-mono font-bold text-white">{formatCurrency(pvp)}</td>
                                                    <td className="p-4 text-right font-mono text-green-400 font-bold">{formatCurrency(margin)}</td>
                                                    <td className="p-4 text-right font-mono text-brand-accent font-bold">{marginPct.toFixed(1).replace('.', ',')}%</td>
                                                    <td className={`p-4 text-right font-mono font-bold ${statusColor}`}>{foodCost.toFixed(1).replace('.', ',')}%</td>
                                                    <td className="p-4 text-center">
                                                        <span 
                                                            title={statusTooltip}
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border cursor-help ${statusBadge}`}
                                                        >
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredProducts.filter(p => p.is_compound).length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center text-gray-500">
                                                    No hay recetas compuestas en la selección actual. Puedes crearlas desde el módulo de Inventario y Carta.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 3: CÁLCULO AUTOMÁTICO Y MASIVO DE PVP */}
                {/* ========================================================================= */}
                {activeTab === 'pricing' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Mass Pricing Controls */}
                            <div className="bg-brand-800 rounded-2xl border border-brand-700 p-6 shadow-lg lg:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calculator className="text-brand-accent" size={24} />
                                    <h2 className="text-xl font-bold text-white">Cálculo y Ajuste Masivo de Precios</h2>
                                </div>
                                <p className="text-gray-300 text-sm mb-6">
                                    Ajusta el PVP de todos los platos basándote en la fórmula contable: <strong className="text-white">PVP = Coste / (1 - Margen Objetivo)</strong>.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Familia de Productos</label>
                                        <select 
                                            className="w-full bg-brand-900 border border-brand-600 rounded-xl p-3 text-white outline-none focus:border-brand-accent text-sm"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="all">Todas las familias ({productsWithCalculatedCosts.length} productos)</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Margen Objetivo Deseado (%)</label>
                                        <div className="flex items-center gap-3 h-[48px]">
                                            <div className="flex items-center justify-between min-w-[90px] h-full bg-brand-900 border border-brand-600 rounded-xl px-3 focus-within:border-brand-accent">
                                                <input 
                                                    type="number" 
                                                    min="1" 
                                                    max="99"
                                                    className="bg-transparent text-white outline-none text-lg font-bold text-center w-12"
                                                    value={targetMargin || ''}
                                                    onChange={(e) => setTargetMargin(Number(e.target.value))}
                                                />
                                                <span className="text-gray-400 font-bold ml-1">%</span>
                                                <div className="flex flex-col border-l border-brand-700 ml-2 pl-2">
                                                    <button 
                                                        onClick={() => setTargetMargin(m => Math.min(99, m + 1))}
                                                        className="text-gray-500 hover:text-white"
                                                    >
                                                        <ChevronUp size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setTargetMargin(m => Math.max(1, m - 1))}
                                                        className="text-gray-500 hover:text-white"
                                                    >
                                                        <ChevronDown size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setIsConfirmingMassPrice(true)}
                                                disabled={isCalculating || filteredProducts.length === 0}
                                                className="flex-1 h-full bg-brand-accent hover:bg-brand-accentHover text-white px-4 rounded-xl font-bold transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 text-sm"
                                            >
                                                {isCalculating ? <RefreshCw className="animate-spin" size={18} /> : <TrendingUp size={18} />}
                                                <span>Aplicar a {filteredProducts.length} productos</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-brand-900/60 p-4 rounded-xl border border-brand-700/80 text-xs text-gray-300 space-y-1">
                                    <p className="font-semibold text-brand-accent flex items-center gap-1.5">
                                        <Info size={14} /> Regla de Redondeo Comercial:
                                    </p>
                                    <p>
                                        El sistema redondea automáticamente al decimal superior (múltiplo de 0,10 €) para evitar tarifas incómodas de cambio en barra y agilizar el cobro en sala.
                                    </p>
                                </div>
                            </div>

                            {/* Impact summary card */}
                            <div className="bg-brand-800 rounded-2xl border border-brand-700 p-6 shadow-lg flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                        <DollarSign className="text-green-400" size={20} />
                                        Impacto Estimado
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-4">
                                        Proyección de aumento en beneficio si se aplican los precios calculados a las ventas del periodo seleccionado.
                                    </p>
                                    <div className="space-y-3 font-mono text-xs">
                                        <div className="flex justify-between p-2 rounded-lg bg-brand-900/60">
                                            <span className="text-gray-400">Platos afectados:</span>
                                            <strong className="text-white">{filteredProducts.length}</strong>
                                        </div>
                                        <div className="flex justify-between p-2 rounded-lg bg-brand-900/60">
                                            <span className="text-gray-400">Margen promedio actual:</span>
                                            <strong className="text-yellow-400">
                                                {filteredProducts.length > 0 
                                                    ? (filteredProducts.reduce((s, p) => {
                                                        const c = p.calculated_cost || 0;
                                                        const v = p.selling_price || 0;
                                                        return s + (v > 0 ? ((v - c) / v) * 100 : 0);
                                                    }, 0) / filteredProducts.length).toFixed(1)
                                                    : '0'}%
                                            </strong>
                                        </div>
                                        <div className="flex justify-between p-2 rounded-lg bg-brand-900/60">
                                            <span className="text-gray-400">Nuevo Margen Uniforme:</span>
                                            <strong className="text-green-400 font-bold">{targetMargin}%</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-brand-700 text-xs text-gray-400 italic">
                                    Nota: Los cambios de precio se reflejan inmediatamente en el TPV de sala.
                                </div>
                            </div>
                        </div>

                        {/* Preview Table for Mass Pricing */}
                        <div className="bg-brand-800 rounded-2xl border border-brand-700 shadow-lg overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-brand-700 bg-brand-800/80 flex justify-between items-center">
                                <h3 className="font-bold text-white">
                                    Simulación de Precios Previos al Guardado
                                </h3>
                                <span className="text-xs text-gray-400">
                                    Mostrando {filteredProducts.length} productos
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs md:text-sm">
                                    <thead className="bg-brand-900/80 sticky top-0 z-10 border-b border-brand-700">
                                        <tr>
                                            <th className="p-3 font-bold text-gray-400 uppercase">Producto</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase text-right">Coste Real</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase text-right">PVP Actual</th>
                                            <th className="p-3 font-bold text-gray-400 uppercase text-right">Margen Actual</th>
                                            <th className="p-3 font-bold text-brand-accent uppercase text-right">PVP Sugerido ({targetMargin}%)</th>
                                            <th className="p-3 font-bold text-brand-accent uppercase text-right">Diferencia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-700/50">
                                        {filteredProducts.map(p => {
                                            const cost = p.calculated_cost || 0;
                                            const pvp = p.selling_price || 0;
                                            const currMargin = pvp > 0 ? ((pvp - cost) / pvp) * 100 : 0;
                                            const suggestedPvp = cost > 0 ? Math.ceil((cost / (1 - (targetMargin / 100))) * 10) / 10 : pvp;
                                            const diff = suggestedPvp - pvp;

                                            return (
                                                <tr key={p.id} className="hover:bg-brand-700/20">
                                                    <td className="p-3 font-semibold text-white">{p.name}</td>
                                                    <td className="p-3 text-right font-mono text-gray-300">{formatCurrency(cost)}</td>
                                                    <td className="p-3 text-right font-mono text-gray-400">{formatCurrency(pvp)}</td>
                                                    <td className="p-3 text-right font-mono text-yellow-400">{currMargin.toFixed(1)}%</td>
                                                    <td className="p-3 text-right font-mono font-black text-green-400">{formatCurrency(suggestedPvp)}</td>
                                                    <td className={`p-3 text-right font-mono font-bold ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                        {diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 4: SIMULADOR INTERACTIVO WHAT-IF */}
                {/* ========================================================================= */}
                {activeTab === 'simulator' && (
                    <div className="space-y-6">
                        <div className="bg-brand-800 rounded-2xl border border-brand-700 p-6 shadow-lg">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-700">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                        <TrendingUp className="text-brand-accent" size={24} />
                                        Simulador de Escenarios de Precio y Margen (What-If)
                                    </h2>
                                    <p className="text-gray-300 text-xs sm:text-sm mt-1">
                                        Ajusta el PVP o el coste de materia prima de forma individual para predecir el beneficio neto sin tocar la base de datos hasta que decidas guardarlo.
                                    </p>
                                </div>
                                <div className="w-full md:w-72">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Seleccionar Plato a Simular</label>
                                    <select 
                                        className="w-full bg-brand-900 border border-brand-600 rounded-xl p-2.5 text-white outline-none focus:border-brand-accent text-sm"
                                        value={activeProductToSimulate?.id || ''}
                                        onChange={(e) => setSelectedProductToSimulate(e.target.value)}
                                    >
                                        {bcgData.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.category_bcg})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {activeProductToSimulate && (
                                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Sliders and Controls */}
                                    <div className="lg:col-span-2 space-y-6 bg-brand-900/60 p-6 rounded-2xl border border-brand-700">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-base text-white flex items-center gap-2">
                                                <span>{activeProductToSimulate.name}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getBCGColor(activeProductToSimulate.category_bcg).badge}`}>
                                                    {activeProductToSimulate.category_bcg}
                                                </span>
                                            </h3>
                                            <span className="text-xs text-gray-400">
                                                {activeProductToSimulate.category_name}
                                            </span>
                                        </div>

                                        {/* Slider 1: PVP */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-300 uppercase">Precio de Venta al Público (PVP)</label>
                                                <span className="font-mono text-xl font-black text-green-400">{formatCurrency(simulatedPrice)}</span>
                                            </div>
                                            <input 
                                                type="range"
                                                min={Math.max(0.5, activeProductToSimulate.cost * 0.8)}
                                                max={Math.max(20, activeProductToSimulate.selling_price * 2.5)}
                                                step="0.10"
                                                value={simulatedPrice}
                                                onChange={(e) => setSimulatedPrice(Number(e.target.value))}
                                                className="w-full accent-brand-accent cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 font-mono">
                                                <span>Actual: {formatCurrency(activeProductToSimulate.selling_price)}</span>
                                                <span>Variación: {simulatedPrice >= activeProductToSimulate.selling_price ? `+${formatCurrency(simulatedPrice - activeProductToSimulate.selling_price)}` : formatCurrency(simulatedPrice - activeProductToSimulate.selling_price)}</span>
                                            </div>
                                        </div>

                                        {/* Slider 2: Coste Materia Prima */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-300 uppercase">Coste de Materia Prima / Escandallo</label>
                                                <span className="font-mono text-xl font-black text-red-400">{formatCurrency(simulatedCost)}</span>
                                            </div>
                                            <input 
                                                type="range"
                                                min={0.10}
                                                max={Math.max(15, activeProductToSimulate.cost * 2)}
                                                step="0.05"
                                                value={simulatedCost}
                                                onChange={(e) => setSimulatedCost(Number(e.target.value))}
                                                className="w-full accent-red-500 cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 font-mono">
                                                <span>Original: {formatCurrency(activeProductToSimulate.cost)}</span>
                                                <span>Variación: {simulatedCost >= activeProductToSimulate.cost ? `+${formatCurrency(simulatedCost - activeProductToSimulate.cost)}` : formatCurrency(simulatedCost - activeProductToSimulate.cost)}</span>
                                            </div>
                                        </div>

                                        {/* Actions to apply or reset */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-brand-800">
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        await updateProductMutation.mutateAsync({
                                                            id: activeProductToSimulate.id,
                                                            data: { selling_price: simulatedPrice }
                                                        });
                                                        setNotification({
                                                            title: "Precio Guardado",
                                                            message: `Se ha establecido el nuevo PVP de ${activeProductToSimulate.name} en ${formatCurrency(simulatedPrice)}.`,
                                                            type: 'success'
                                                        });
                                                    } catch (e) {
                                                        setNotification({
                                                            title: "Error",
                                                            message: "No se pudo guardar el precio.",
                                                            type: 'error'
                                                        });
                                                    }
                                                }}
                                                className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accentHover text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 text-xs sm:text-sm"
                                            >
                                                <Check size={16} />
                                                <span>Fijar este PVP en el TPV ({formatCurrency(simulatedPrice)})</span>
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setSimulatedPrice(activeProductToSimulate.selling_price);
                                                    setSimulatedCost(activeProductToSimulate.cost);
                                                }}
                                                className="px-4 py-2.5 bg-brand-800 hover:bg-brand-700 text-gray-300 font-medium rounded-xl transition-colors border border-brand-700 text-xs sm:text-sm"
                                            >
                                                Restablecer valores
                                            </button>
                                        </div>
                                    </div>

                                    {/* Calculated Result KPIs */}
                                    {(() => {
                                        const newMargin = simulatedPrice - simulatedCost;
                                        const newMarginPct = simulatedPrice > 0 ? (newMargin / simulatedPrice) * 100 : 0;
                                        const newFoodCost = simulatedPrice > 0 ? (simulatedCost / simulatedPrice) * 100 : 0;
                                        const salesQty = activeProductToSimulate.quantity_sold || 10;
                                        const projectedProfit = salesQty * newMargin;
                                        const oldProfit = activeProductToSimulate.total_profit;
                                        const profitDiff = projectedProfit - oldProfit;

                                        return (
                                            <div className="bg-brand-900/60 p-6 rounded-2xl border border-brand-700 flex flex-col justify-between space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                                        Resultado de la Simulación
                                                    </h4>
                                                    <div className="space-y-3 font-mono">
                                                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-brand-800/60">
                                                            <span className="text-xs text-gray-300">Margen Bruto Unitario:</span>
                                                            <strong className="text-base text-green-400">{formatCurrency(newMargin)}</strong>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-brand-800/60">
                                                            <span className="text-xs text-gray-300">Margen Porcentual:</span>
                                                            <strong className="text-base text-brand-accent">{newMarginPct.toFixed(1)}%</strong>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-brand-800/60">
                                                            <span className="text-xs text-gray-300">Food Cost Resultante:</span>
                                                            <strong className={`text-base ${newFoodCost > 35 ? 'text-red-400' : newFoodCost > 28 ? 'text-yellow-400' : 'text-green-400'}`}>
                                                                {newFoodCost.toFixed(1)}%
                                                            </strong>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-brand-800/60">
                                                            <span className="text-xs text-gray-300">Beneficio Proyectado ({salesQty} u.):</span>
                                                            <strong className="text-base text-white">{formatCurrency(projectedProfit)}</strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-brand-800">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-400">Variación de Beneficio:</span>
                                                        <span className={`font-mono font-bold text-sm ${profitDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {profitDiff >= 0 ? `+${formatCurrency(profitDiff)}` : formatCurrency(profitDiff)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Report Modal */}
            {aiReport && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-brand-900 border border-brand-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
                        <div className="p-5 border-b border-brand-700 flex justify-between items-center bg-brand-800/80 rounded-t-2xl">
                            <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl">
                                <Sparkles size={22} />
                                <h2>Informe Estratégico de Ingeniería de Menú (Gemini 3.8)</h2>
                            </div>
                            <button 
                                onClick={() => setAiReport(null)}
                                className="text-gray-400 hover:text-white transition-colors bg-brand-800 p-2 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 prose prose-invert prose-yellow max-w-none text-sm md:text-base leading-relaxed">
                            <Markdown>{aiReport}</Markdown>
                        </div>
                        <div className="p-4 bg-brand-800/60 border-t border-brand-700 flex justify-end">
                            <button
                                onClick={() => setAiReport(null)}
                                className="px-5 py-2 bg-brand-700 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors text-sm"
                            >
                                Entendido, Volver a la Matriz
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Mass Pricing Modal */}
            {isConfirmingMassPrice && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-brand-900 border border-brand-700 rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-in zoom-in-95">
                        <div className="p-5 border-b border-brand-700 flex justify-between items-center bg-brand-800/80 rounded-t-2xl">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                                <AlertTriangle className="text-yellow-400" size={22} />
                                Confirmar Recálculo Masivo
                            </h2>
                        </div>
                        <div className="p-6 text-gray-300 text-sm space-y-3">
                            <p>
                                ¿Confirmas que deseas recalcular y actualizar los precios de <strong className="text-white">{filteredProducts.length} productos</strong> para fijar un margen objetivo del <strong className="text-green-400 font-bold">{targetMargin}%</strong>?
                            </p>
                            <p className="text-xs text-gray-400">
                                Los nuevos importes se aplicarán de inmediato a las comandas de sala del TPV.
                            </p>
                        </div>
                        <div className="p-4 border-t border-brand-700 flex justify-end gap-3 bg-brand-800/40 rounded-b-2xl">
                            <button 
                                onClick={() => setIsConfirmingMassPrice(false)}
                                className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-xl transition-colors border border-brand-600 text-xs sm:text-sm font-medium"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={executeMassPricing}
                                className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-white rounded-xl transition-colors font-bold text-xs sm:text-sm shadow-md"
                            >
                                Sí, Actualizar Precios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toast/Modal */}
            {notification && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-brand-900 border border-brand-700 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
                        <div className={`p-4 border-b flex justify-between items-center ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <h2 className={`text-base font-bold flex items-center gap-2 ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                                {notification.title}
                            </h2>
                            <button 
                                onClick={() => setNotification(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5 text-gray-300 text-center text-sm">
                            {notification.message}
                        </div>
                        <div className="p-4 bg-brand-800/50">
                            <button 
                                onClick={() => setNotification(null)}
                                className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-xl transition-colors border border-brand-600 w-full font-bold text-sm"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

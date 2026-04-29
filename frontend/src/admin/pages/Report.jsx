import { useAdmin } from "../../Context/AdminContext";
import { Card, CardContent } from "../component/ui/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Report = () => {
  const { AllOrders, YearlyOrders, MonthlyOrders } = useAdmin();

  // --- Loading check ---
  const loading =
    !AllOrders || !MonthlyOrders || !YearlyOrders || AllOrders.length === 0;

  if (loading) {
    return <div className="p-6 text-lg">⏳ Loading report data...</div>;
  }

  // --- Quick stats ---
  const totalOrders = AllOrders.length;
  const monthlyOrders = MonthlyOrders.length;
  const yearlyOrders = YearlyOrders.length;

  console.log("Orders Count:", monthlyOrders, yearlyOrders, totalOrders);

  // --- Calculate total revenue (backend uses totalAmount) ---
  const totalRevenue = AllOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  // --- Prepare Monthly Revenue Data (BarChart) ---
  const monthlyRevenue = MonthlyOrders.map((order) => ({
    month: new Date(order.orderedAt).toLocaleString("default", {
      month: "short",
    }),
    amount: order.totalAmount || 0,
  }));

  // --- Prepare Monthly Order Count Data (LineChart) ---
  const monthlyOrderCounts = MonthlyOrders.reduce((acc, order) => {
    const month = new Date(order.orderedAt).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthlyOrdersData = Object.keys(monthlyOrderCounts).map((month) => ({
    month,
    orders: monthlyOrderCounts[month],
  }));

  // --- Pie chart for Order Status Distribution ---
  const statusCounts = AllOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#D72638"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Report Dashboard</h1>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Total Orders</h2>
            <p className="text-2xl">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Monthly Orders</h2>
            <p className="text-2xl">{monthlyOrders}</p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Yearly Orders</h2>
            <p className="text-2xl">{yearlyOrders}</p>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p className="text-2xl">₹{totalRevenue}</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Line Chart for Monthly Orders --- */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">📈 Monthly Orders Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#0088FE"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* --- Bar Chart for Monthly Revenue --- */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">💰 Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* --- Pie Chart for Order Status --- */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">📦 Order Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Report;

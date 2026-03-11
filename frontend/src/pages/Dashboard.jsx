import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Card from "../components/Card";
import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Topbar />

        <div className="content">
          <Card title="Card 1" />
          <Card title="Card 2" />
          <Card title="Card 3" />
          <Card title="Card 4" />
        </div>
      </div>
    </div>
  );
}

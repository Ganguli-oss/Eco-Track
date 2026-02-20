# 🌍 Eco-Track v1.0
> **Live Dashboard:** [https://ganguli-oss.github.io/Eco-Track/](https://ganguli-oss.github.io/Eco-Track/)

Eco-Track is a professional-grade full-stack application designed to audit and visualize global carbon intensity data in real-time. By combining a Python-based auditing backend with a Next.js analytics frontend, it provides actionable insights into environmental impact.

---

## 🏗️ Project Architecture

### 🐍 Backend (The Auditor)
Located in the `/backend` folder, this service acts as the heart of the project.
* **Automated Logging**: Python scripts fetch real-time carbon data for over 30 global regions.
* **Cloud Integration**: Uses the Supabase SDK to securely store data logs.
* **Isolated Environment**: Managed via a dedicated virtual environment (`env/`) for dependency stability.

### ⚛️ Frontend (The Dashboard)
Located in the `/frontend` folder, this provides the "face" of Eco-Track.
* **Dynamic Visualization**: Uses `recharts` to render interactive area graphs for Day, Week, and Month views.
* **TypeScript & Tailwind**: Built for performance and responsiveness using modern CSS and type-safe components.
* **Iconography**: Integrated with `lucide-react` for a clean, intuitive UI.

---

## 🛠️ Installation & Setup

### Prerequisites
* **Python 3.x** and **Node.js 18+**
* **Supabase Account** with API keys.

### Local Development
1. **Clone the repository**:
   ```bash
   git clone [https://github.com/Ganguli-oss/Eco-Track.git](https://github.com/Ganguli-oss/Eco-Track.git)

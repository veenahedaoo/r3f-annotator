# 🚀 3D Drone Annotation System

A performant **3D annotation web application** built with **React + React Three Fiber (R3F)**.  
Users can load a `.glb` 3D model (e.g., a drone), inspect it, and draw **points, lines, and polygons** directly on the surface of the model.  
The app calculates and displays **distances** and **areas** interactively.  

---

## ✨ Features

- ⚡ **Built with React + R3F** for declarative 3D rendering.  
- 📦 **GLB Model Loader** (`.glb` / glTF) with auto-fit camera.  
- 🎨 **Leva UI Panel** for:  
  - Mode switching → `Point | Line | Polygon`  
  - Annotation color selection  
  - Lighting control (intensity + color)  
- 📍 **Annotation tools**:  
  - **Points** → place and orient on model surface  
  - **Lines** → draw lines with live preview + length labels  
  - **Polygons** → draw polygons with live preview + semi-transparent fill + area labels  
- 🧭 **Orbit Controls** → rotate, zoom, pan around the model  
- ⚡ **High performance** → accelerated raycasting with `three-mesh-bvh`  
- ⏳ **Loading progress bar** while model is being fetched  

---

## 🖼️ Demo

*(Add a screenshot or GIF of your app here once you capture one)*  

---

## 📂 Project Structure

```
src/
 ├── App.jsx               # Main app with Canvas & lights
 ├── components/
 │    ├── Model.jsx        # Loads GLB model & auto-fits camera
 │    ├── Annotations.jsx  # Handles points, lines, polygons
 │    └── ControlsPanel.jsx# Leva UI + Zustand store
 ├── utils/
 │    ├── camera.js        # Camera fitting helper
 │    └── math3d.js        # Geometry helpers (length, area)
 ├── bvh-setup.js          # Enables three-mesh-bvh acceleration
```

---

## 🛠️ Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/3d-drone-annotation.git
   cd 3d-drone-annotation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 📦 Dependencies

- [React](https://react.dev/)  
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)  
- [@react-three/drei](https://docs.pmnd.rs/drei/introduction)  
- [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)  
- [Leva](https://github.com/pmndrs/leva)  
- [Zustand](https://github.com/pmndrs/zustand)  

---

## 🎮 Usage

1. **Load your 3D model**  
   - Place a `.glb` file inside the `public/` folder (e.g., `public/drone.glb`).  
   - Update the `<Model url="/drone.glb" />` prop if needed.  

2. **Annotation Modes** (switchable via Leva panel):  
   - **Point** → click to place spheres.  
   - **Line** → click to place vertices, preview line follows mouse, double-click to finalize, length displayed.  
   - **Polygon** → click to add vertices, preview outline shown, double-click to finalize, area displayed.  

3. **Controls**  
   - Left Mouse → Rotate  
   - Scroll → Zoom  
   - Right Mouse → Pan  

---

## ⚡ Performance Notes

- Uses `three-mesh-bvh` for fast raycasting on complex models.  
- Auto-fits camera to model bounding box.  
- Lightweight UI with Leva for real-time tweaks.  

---


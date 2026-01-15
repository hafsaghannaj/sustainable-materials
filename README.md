Bend the emissions curve of the built environment
==========

Architecture
------------
```mermaid
graph TB
    subgraph "Platform Layer"
        P1[Load Balancer<br/>NGINX + Istio]
        P2[API Gateway<br/>Kong/Envoy]
        P3[Service Mesh<br/>Istio Linkerd]
    end
    
    subgraph "Application Layer"
        A1[LCA Microservice<br/>gRPC + Protocol Buffers]
        A2[Generative AI Service<br/>TensorFlow Serving]
        A3[Blockchain Oracle<br/>Chainlink + Hyperledger]
        A4[Geospatial Service<br/>PostGIS + Cesium]
    end
    
    subgraph "Data Layer"
        D1[Vector DB<br/>Pinecone/Weaviate]
        D2[Time-Series DB<br/>TimescaleDB]
        D3[Graph DB<br/>Neo4j]
        D4[Data Lake<br/>Delta Lake]
    end
    
    subgraph "Integration Layer"
        I1[Revit Add-in<br/>C++/NET]
        I2[Rhino/Grasshopper<br/>Python/C#]
        I3[Unreal Engine 5<br/>C++ Plugin]
        I4[BIM 360 API]
    end
    
    P1 --> A1
    P1 --> A2
    P1 --> A3
    A1 --> D1
    A2 --> D2
    A3 --> D3
    A1 --> I1
    A2 --> I2
    A3 --> I4
```

Quick Start
-----------
1) Set environment variables (optional):
   - `export ECOINVENT_API_KEY=...`
   - `export REVIT_API_KEY=...`
2) Start the stack:
   - `docker compose up --build`
3) Open the API:
   - `http://localhost:8000`

Health and Tasks
----------------
- Healthcheck: `GET /health`
- Celery ping: `POST /tasks/ping`
- Task status: `GET /tasks/status/{task_id}`

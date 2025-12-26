# 🤖 AI Engineer Trainee - RAG Q&A Chatbot

Ce projet est une application de **RAG (Retrieval-Augmented Generation)** complète. Elle permet d'ingérer des documents (PDF, TXT, MD) et de répondre à des questions en utilisant le contexte extrait, grâce à l'API **Google Gemini** et une base de données vectorielle locale.

## 🏗 Architecture du Système

L'architecture est conçue pour être modulaire et scalable. Voici le flux de données :

![Architecture du Projet](https://ibb.co/LDbnXYST)

### Flux de données :
1. **Ingestion :** Les documents sont chargés, découpés en chunks, transformés en embeddings via **HuggingFace** (local) et stockés dans **ChromaDB**.
2. **Récupération (Retrieval) :** Lors d'une question, le système cherche les segments les plus pertinents par similarité cosinus.
3. **Génération :** Le contexte et la question sont envoyés au modèle **Gemini-1.5-Flash** pour générer une réponse précise avec citations des sources.

---

## 🛠 Stack Technique

- **Backend :** FastAPI (Python 3.10)
- **Frontend :** Next.js 14 (App Router) + Tailwind CSS
- **Framework RAG :** LangChain (LCEL - LangChain Expression Language)
- **LLM :** Google Gemini-1.5-Flash
- **Embeddings :** HuggingFace `all-MiniLM-L6-v2` (Exécution CPU locale)
- **Vector Store :** ChromaDB (Persistante)
- **Conteneurisation :** Docker & Docker Compose

---

## 📁 Structure du Projet

```text
.
├── backend/
│   ├── data/              # Documents à ingérer (ex: Data.pdf)
│   ├── chroma_db/         # Base de données vectorielle persistante
│   ├── main.py            # API REST FastAPI
│   ├── ingestion.py       # Script de traitement des documents
│   ├── Dockerfile         # Image Docker Backend
│   └── requirements.txt   # Dépendances Python
├── frontend/
│   ├── app/               # UI Next.js
│   ├── Dockerfile         # Image Docker Frontend
│   └── package.json       # Dépendances Node.js
├── architecture.png       # Schéma de l'architecture
├── docker-compose.yml     # Orchestration des services
├── docker.sh              # Script d'automatisation des commandes
└── .env                   # Variables d'environnement (Clé API)

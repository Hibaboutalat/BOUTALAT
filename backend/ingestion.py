import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

def ingest_docs():
    # Chemin vers le PDF (dans le dossier data du backend)
    pdf_path = "./data/Data.pdf"
    persist_directory = "./chroma_db"

    if not os.path.exists(pdf_path):
        print(f"Erreur : {pdf_path} introuvable.")
        return

    print("Chargement du document...")
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    print("Découpage en morceaux...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)

    print("Génération des embeddings (HuggingFace)...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    print("Stockage dans ChromaDB...")
    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    print("Ingestion réussie ! Base de données créée dans ./chroma_db")

if __name__ == "__main__":
    ingest_docs()
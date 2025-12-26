from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Autoriser le Frontend (Next.js) à communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

# Configuration globale
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
retriever = vector_db.as_retriever(search_kwargs={"k": 3})
llm = ChatGoogleGenerativeAI(model="gemini-flash-latest")

# Template de réponse
template = """Réponds à la question en te basant uniquement sur le contexte fourni. 
Si tu ne sais pas, dis que tu ne sais pas.
Contexte: {context}
Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Chaîne de traitement LCEL
setup_and_retrieval = RunnableParallel(
    {"context": retriever, "question": RunnablePassthrough()}
)

chain = (
    setup_and_retrieval 
    | {
        "answer": (lambda x: prompt.format(context=format_docs(x["context"]), question=x["question"])) | llm | StrOutputParser(),
        "sources": lambda x: list(set([os.path.basename(doc.metadata.get("source", "Inconnu")) for doc in x["context"]]))
    }
)

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    result = chain.invoke(request.question)
    return {
        "answer": result["answer"],
        "sources": result["sources"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
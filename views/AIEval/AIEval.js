'use client';
import React from 'react';
import CodeBlock from '@/components/CodeBlock/CodeBlock';
import Navigation from '@/components/Navigation/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiCheckCircle, FiAward, FiExternalLink } from 'react-icons/fi';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'rag-pipeline', label: 'RAG Pipeline' },
  { id: 'deepeval-setup', label: 'DeepEval Setup' },
  { id: 'golden-dataset', label: 'Golden Dataset' },
  { id: 'running-rag', label: 'Running the RAG' },
  { id: 'evaluation-metrics', label: 'Evaluation Metrics' },
  { id: 'full-workflow', label: 'Full Workflow' },
  { id: 'recommended-courses', label: 'Courses' },
];

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const installCode = `# Install all required packages
pip install deepeval langchain langchain-openai langchain-community faiss-cpu

# Login to Confident AI (one-time setup)
deepeval login`;

const envSetupCode = `# .env file
OPENAI_API_KEY=sk-your-openai-api-key`;

const ragPipelineCode = `from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader

# 1. Load the business document
loader = TextLoader("company_policy.txt", encoding="utf-8")
documents = loader.load()

# 2. Split into chunks for embedding
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
)
chunks = splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunks")

# 3. Create embeddings and store in FAISS vector store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = FAISS.from_documents(chunks, embeddings)

# 4. Create a retriever (returns top 3 most relevant chunks)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 5. Initialize the LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def ask_rag(question: str) -> tuple[str, str]:
    """Ask a question to the RAG pipeline.

    Returns:
        tuple: (actual_output, retrieval_context)
    """
    # Retrieve relevant chunks
    docs = retriever.invoke(question)
    context = "\\n\\n".join(doc.page_content for doc in docs)

    # Generate answer using the LLM
    prompt = f"""Answer the question based ONLY on the following context.
If the context doesn't contain the answer, say "I don't have enough information."

Context:
{context}

Question: {question}

Answer:"""

    response = llm.invoke(prompt)
    return response.content, context`;

const businessDocCode = `# company_policy.txt (example business document)

## Refund Policy
Customers can request a full refund within 30 days of purchase.
After 30 days, a partial refund of 50% is available up to 90 days.
Digital products are non-refundable once downloaded.

## Employee Benefits
Full-time employees receive 20 paid vacation days per year.
Part-time employees receive 10 paid vacation days.
Unused vacation days can be carried over to the next year,
up to a maximum of 5 days.

## Remote Work Policy
Employees may work remotely up to 3 days per week.
A minimum of 2 days per week must be spent in the office.
Remote work requests must be approved by the direct manager.

## Data Security
All employees must use two-factor authentication (2FA) for
company accounts. Sensitive data must be encrypted at rest
and in transit. Security training is mandatory every quarter.`;

const createGoldensCode = `from deepeval.dataset import EvaluationDataset, Golden

# Create golden test cases — these define "correct" behavior.
# Each golden has an INPUT (the question) and an EXPECTED OUTPUT
# (the ideal answer the RAG should produce).

goldens = [
    Golden(
        input="What is the refund policy for digital products?",
        expected_output="Digital products are non-refundable once downloaded."
    ),
    Golden(
        input="How many vacation days do full-time employees get?",
        expected_output="Full-time employees receive 20 paid vacation days per year."
    ),
    Golden(
        input="Can unused vacation days be carried over?",
        expected_output="Unused vacation days can be carried over to the next year, up to a maximum of 5 days."
    ),
    Golden(
        input="How many days per week can employees work remotely?",
        expected_output="Employees may work remotely up to 3 days per week."
    ),
    Golden(
        input="What security training is required for employees?",
        expected_output="Security training is mandatory every quarter."
    ),
]

# Push goldens to Confident AI for storage and versioning
dataset = EvaluationDataset(goldens=goldens)
dataset.push(alias="company-policy-goldens")
print("Goldens pushed to Confident AI!")`;

const pullAndRunCode = `from deepeval.dataset import EvaluationDataset
from deepeval.test_case import LLMTestCase

# 1. Pull the golden dataset from Confident AI
dataset = EvaluationDataset()
dataset.pull(alias="company-policy-goldens")
print(f"Pulled {len(dataset.goldens)} goldens")

# 2. For each golden, run the RAG to get actual_output and context
test_cases = []

for golden in dataset.goldens:
    # The golden gives us: input + expected_output
    # The RAG gives us:    actual_output + retrieval_context
    actual_output, retrieval_context = ask_rag(golden.input)

    test_case = LLMTestCase(
        input=golden.input,                      # from golden
        expected_output=golden.expected_output,   # from golden
        actual_output=actual_output,              # from RAG
        retrieval_context=[retrieval_context],    # from RAG
    )
    test_cases.append(test_case)
    print(f"✓ Processed: {golden.input[:50]}...")

print(f"\\nBuilt {len(test_cases)} test cases ready for evaluation")`;

const metricsCode = `from deepeval import evaluate
from deepeval.metrics import (
    AnswerRelevancyMetric,
    HallucinationMetric,
    FaithfulnessMetric,
    GEval,
)
from deepeval.test_case import LLMTestCaseParams

# --- Built-in Metrics ---

# Does the answer actually address the question?
answer_relevancy = AnswerRelevancyMetric(
    model="gpt-4o",
    threshold=0.7,
)

# Does the answer contain information NOT in the context?
hallucination = HallucinationMetric(
    model="gpt-4o",
    threshold=0.5,
)

# Is the answer faithful to (supported by) the retrieved context?
faithfulness = FaithfulnessMetric(
    model="gpt-4o",
    threshold=0.7,
)

# --- Custom Metric with GEval ---

# GEval lets you define your own evaluation criteria.
# The LLM judge will score based on YOUR custom instructions.
completeness = GEval(
    name="Completeness",
    criteria="Determine whether the actual output fully and "
             "accurately addresses every aspect of the input "
             "question using information from the retrieval context. "
             "Penalize if key details are missing or if the answer "
             "is too vague.",
    evaluation_params=[
        LLMTestCaseParams.INPUT,
        LLMTestCaseParams.ACTUAL_OUTPUT,
        LLMTestCaseParams.RETRIEVAL_CONTEXT,
    ],
    model="gpt-4o",
    threshold=0.7,
)

# --- Run Evaluation ---

results = evaluate(
    test_cases=test_cases,
    metrics=[answer_relevancy, hallucination, faithfulness, completeness],
)

# Results are automatically uploaded to Confident AI dashboard
print("Evaluation complete! Check your Confident AI dashboard for details.")`;

const fullWorkflowCode = `"""
Full RAG Evaluation Workflow
============================
1. Load business document → build RAG pipeline
2. Pull golden dataset from Confident AI
3. Run RAG for each golden → get actual_output + context
4. Evaluate with built-in + custom metrics (LLM-as-judge)
5. View results in Confident AI dashboard
"""

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from deepeval import evaluate
from deepeval.dataset import EvaluationDataset
from deepeval.test_case import LLMTestCase, LLMTestCaseParams
from deepeval.metrics import (
    AnswerRelevancyMetric,
    HallucinationMetric,
    FaithfulnessMetric,
    GEval,
)

# ── Step 1: Build the RAG Pipeline ──────────────────────────

loader = TextLoader("company_policy.txt", encoding="utf-8")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(documents)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = FAISS.from_documents(chunks, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)


def ask_rag(question: str) -> tuple[str, str]:
    docs = retriever.invoke(question)
    context = "\\n\\n".join(doc.page_content for doc in docs)
    prompt = f"""Answer based ONLY on the context below.
If unsure, say "I don't have enough information."

Context:
{context}

Question: {question}
Answer:"""
    response = llm.invoke(prompt)
    return response.content, context


# ── Step 2: Pull Goldens from Confident AI ──────────────────

dataset = EvaluationDataset()
dataset.pull(alias="company-policy-goldens")
print(f"Pulled {len(dataset.goldens)} goldens from Confident AI")

# ── Step 3: Run RAG → Build Test Cases ──────────────────────

test_cases = []
for golden in dataset.goldens:
    actual_output, retrieval_context = ask_rag(golden.input)
    test_cases.append(
        LLMTestCase(
            input=golden.input,
            expected_output=golden.expected_output,
            actual_output=actual_output,
            retrieval_context=[retrieval_context],
        )
    )
print(f"Built {len(test_cases)} test cases")

# ── Step 4: Define Metrics ──────────────────────────────────

metrics = [
    AnswerRelevancyMetric(model="gpt-4o", threshold=0.7),
    HallucinationMetric(model="gpt-4o", threshold=0.5),
    FaithfulnessMetric(model="gpt-4o", threshold=0.7),
    GEval(
        name="Completeness",
        criteria="Does the actual output fully address every aspect "
                 "of the question using the retrieval context?",
        evaluation_params=[
            LLMTestCaseParams.INPUT,
            LLMTestCaseParams.ACTUAL_OUTPUT,
            LLMTestCaseParams.RETRIEVAL_CONTEXT,
        ],
        model="gpt-4o",
        threshold=0.7,
    ),
]

# ── Step 5: Evaluate ────────────────────────────────────────

results = evaluate(test_cases=test_cases, metrics=metrics)
print("Done! View results at https://app.confident-ai.com")`;

const testCaseExplainCode = `# What each field in LLMTestCase represents:

LLMTestCase(
    # FROM THE GOLDEN (what we expect):
    input="How many vacation days do full-time employees get?",
    expected_output="Full-time employees receive 20 paid vacation days per year.",

    # FROM THE RAG (what we actually got):
    actual_output="Full-time employees get 20 paid vacation days annually.",
    retrieval_context=["Full-time employees receive 20 paid vacation days per year. "
                       "Part-time employees receive 10 paid vacation days."],
)`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function AIEval() {
  const { progress, markPageComplete } = useAuth();
  const isCompleted = progress.aiEval;

  return (
    <div className="ai-eval-page">
      <div className="page-layout container">
        <article className="page-content">

          <h1>AI Evaluation with DeepEval</h1>
          <p className="page-subtitle">
            Learn how to evaluate RAG pipelines and LLM applications using DeepEval,
            Confident AI, and the LLM-as-judge pattern. From building a RAG to running
            custom evaluation metrics.
          </p>

          {/* ── Introduction ── */}
          <section id="introduction">
            <span className="section-label section-label--purple">Overview</span>
            <h2>Introduction</h2>
            <p>
              As AI applications become part of real products, <strong>testing them is no longer
              optional</strong>. Unlike traditional software where outputs are deterministic, LLM outputs
              are probabilistic — the same input can produce different outputs. This makes classical
              assertion-based testing insufficient.
            </p>
            <p>
              <strong>DeepEval</strong> is an open-source evaluation framework for LLM applications. It
              provides both built-in and custom metrics that use an <strong>LLM-as-judge</strong> approach —
              a powerful LLM (like GPT-4o) evaluates the quality of another LLM's responses.
            </p>
            <p>
              <strong>Confident AI</strong> is the companion platform where you can store test datasets
              (called "goldens"), track evaluation results over time, and collaborate with your team.
            </p>

            <div className="info-box">
              <strong>What we'll build</strong>
              In this guide, we'll evaluate a RAG (Retrieval-Augmented Generation) pipeline that reads
              a business document and answers questions about it. We'll create a golden dataset, push it
              to Confident AI, pull it back, run the RAG, and evaluate the results with both built-in
              and custom metrics.
            </div>

            <h3>The Evaluation Flow</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Action</th>
                    <th>Tool</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1</strong></td>
                    <td>Build a RAG pipeline from a business document</td>
                    <td>LangChain + OpenAI</td>
                  </tr>
                  <tr>
                    <td><strong>2</strong></td>
                    <td>Create golden test cases (input + expected output)</td>
                    <td>DeepEval</td>
                  </tr>
                  <tr>
                    <td><strong>3</strong></td>
                    <td>Push goldens to Confident AI for storage</td>
                    <td>Confident AI</td>
                  </tr>
                  <tr>
                    <td><strong>4</strong></td>
                    <td>Pull goldens back and run the RAG for each one</td>
                    <td>DeepEval + RAG</td>
                  </tr>
                  <tr>
                    <td><strong>5</strong></td>
                    <td>Evaluate with metrics (relevancy, hallucination, custom)</td>
                    <td>DeepEval (LLM-as-judge)</td>
                  </tr>
                  <tr>
                    <td><strong>6</strong></td>
                    <td>View results in the dashboard</td>
                    <td>Confident AI</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── RAG Pipeline ── */}
          <section id="rag-pipeline">
            <span className="section-label section-label--green">Foundation</span>
            <h2>Building the RAG Pipeline</h2>
            <p>
              <strong>RAG (Retrieval-Augmented Generation)</strong> is a pattern where instead of
              relying solely on the LLM's training data, you first retrieve relevant information from
              your own documents and then pass it to the LLM as context.
            </p>

            <h3>How RAG Works</h3>
            <p>The flow is straightforward:</p>
            <ol>
              <li><strong>Load</strong> — Read the business document (e.g. company policy, FAQ, knowledge base)</li>
              <li><strong>Chunk</strong> — Split the document into smaller pieces (500 characters each)</li>
              <li><strong>Embed</strong> — Convert each chunk into a numerical vector using an embedding model</li>
              <li><strong>Store</strong> — Save vectors in a vector store (FAISS) for fast similarity search</li>
              <li><strong>Retrieve</strong> — When a question comes in, find the 3 most relevant chunks</li>
              <li><strong>Generate</strong> — Pass the question + relevant chunks to the LLM to generate an answer</li>
            </ol>

            <p>First, let's create the business document we'll use as our knowledge base:</p>
            <CodeBlock code={businessDocCode} language="text" fileName="company_policy.txt" />

            <p>Now let's build the RAG pipeline:</p>
            <CodeBlock code={ragPipelineCode} language="python" fileName="rag_pipeline.py" />

            <div className="tip-box">
              <strong>Why GPT-4o-mini for the RAG?</strong>
              We use the smaller, cheaper model (<code>gpt-4o-mini</code>) for the RAG pipeline since it
              only needs to answer based on provided context. The more powerful <code>gpt-4o</code> is
              reserved for the evaluation step where it acts as a judge.
            </div>
          </section>

          {/* ── DeepEval Setup ── */}
          <section id="deepeval-setup">
            <span className="section-label section-label--blue">Setup</span>
            <h2>DeepEval Setup</h2>
            <p>
              Install DeepEval and the required dependencies, then authenticate with Confident AI:
            </p>
            <CodeBlock code={installCode} language="bash" fileName="terminal" />

            <p>Set your OpenAI API key as an environment variable:</p>
            <CodeBlock code={envSetupCode} language="bash" fileName=".env" />

            <div className="warning-box">
              <strong>API Key Required</strong>
              You need an OpenAI API key for both the RAG pipeline (embeddings + LLM) and the evaluation
              metrics (LLM-as-judge). The <code>deepeval login</code> command will give you a Confident AI
              API key for storing and retrieving datasets.
            </div>
          </section>

          {/* ── Golden Dataset ── */}
          <section id="golden-dataset">
            <span className="section-label section-label--purple">Test Data</span>
            <h2>Creating the Golden Dataset</h2>
            <p>
              A <strong>golden dataset</strong> is a collection of test cases that define what "correct"
              behavior looks like. Each golden has two fields:
            </p>
            <ul>
              <li><strong>input</strong> — the question to ask the RAG</li>
              <li><strong>expected_output</strong> — the ideal answer the RAG should produce</li>
            </ul>
            <p>
              Goldens are the foundation of your evaluation. You write them by hand (or with domain
              experts) based on what the document actually says. Then you push them to Confident AI
              so they're versioned, shareable, and can be pulled into any evaluation run.
            </p>

            <CodeBlock code={createGoldensCode} language="python" fileName="create_goldens.py" />

            <div className="info-box">
              <strong>Why Confident AI?</strong>
              Storing goldens in Confident AI means your test data is centralized and versioned. Team
              members can view, edit, and extend the dataset from the web UI. When you run evaluations,
              results are tracked over time so you can see if your RAG improves or regresses.
            </div>
          </section>

          {/* ── Running the RAG ── */}
          <section id="running-rag">
            <span className="section-label section-label--green">Execution</span>
            <h2>Pulling Goldens & Running the RAG</h2>
            <p>
              Now comes the key step: we pull the goldens from Confident AI, and for each one,
              we run the RAG pipeline to get the <strong>actual output</strong> and the
              <strong> retrieval context</strong>. This gives us the 4 fields needed for evaluation:
            </p>

            <CodeBlock code={testCaseExplainCode} language="python" fileName="test_case_structure.py" />

            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Source</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>input</code></td>
                    <td>Golden</td>
                    <td>The question being asked</td>
                  </tr>
                  <tr>
                    <td><code>expected_output</code></td>
                    <td>Golden</td>
                    <td>The ideal answer (human-written)</td>
                  </tr>
                  <tr>
                    <td><code>actual_output</code></td>
                    <td>RAG</td>
                    <td>What the RAG pipeline actually returned</td>
                  </tr>
                  <tr>
                    <td><code>retrieval_context</code></td>
                    <td>RAG</td>
                    <td>The document chunks the retriever found</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>Here's the code to pull goldens and build test cases:</p>
            <CodeBlock code={pullAndRunCode} language="python" fileName="build_test_cases.py" />

            <div className="tip-box">
              <strong>The 2+2 Pattern</strong>
              Think of it as 2 fields from the golden (input, expected_output) + 2 fields from the RAG
              (actual_output, retrieval_context). The metrics then compare these fields to score quality.
            </div>
          </section>

          {/* ── Evaluation Metrics ── */}
          <section id="evaluation-metrics">
            <span className="section-label section-label--blue">Evaluation</span>
            <h2>Evaluation Metrics</h2>
            <p>
              DeepEval uses <strong>LLM-as-judge</strong>: a powerful LLM (GPT-4o) evaluates the quality
              of the RAG's responses. Each metric focuses on a different quality dimension:
            </p>

            <h3>Built-in Metrics</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Question It Answers</th>
                    <th>Uses</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Answer Relevancy</strong></td>
                    <td>Is the answer relevant to the question asked?</td>
                    <td>input, actual_output</td>
                  </tr>
                  <tr>
                    <td><strong>Hallucination</strong></td>
                    <td>Does the answer contain information NOT in the context?</td>
                    <td>actual_output, retrieval_context</td>
                  </tr>
                  <tr>
                    <td><strong>Faithfulness</strong></td>
                    <td>Is every claim in the answer supported by the context?</td>
                    <td>actual_output, retrieval_context</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Custom Metric with GEval</h3>
            <p>
              <strong>GEval</strong> lets you define your own evaluation criteria in plain English.
              The LLM judge will score responses based on YOUR custom instructions. This is incredibly
              powerful for domain-specific evaluation:
            </p>
            <ul>
              <li><strong>Completeness</strong> — does the answer cover all aspects of the question?</li>
              <li><strong>Tone</strong> — is the answer professional and appropriate?</li>
              <li><strong>Conciseness</strong> — is the answer brief yet informative?</li>
            </ul>
            <p>
              In our example, we create a "Completeness" metric that checks if the RAG's answer
              fully addresses the question using the retrieved context:
            </p>

            <CodeBlock code={metricsCode} language="python" fileName="evaluate_rag.py" />

            <div className="warning-box">
              <strong>Threshold Values</strong>
              Each metric has a <code>threshold</code> (0.0 to 1.0). A test case passes if the score
              is above the threshold. Start with 0.7 and adjust based on your use case. Hallucination
              uses a lower threshold (0.5) because it's an inverse metric — lower hallucination is better.
            </div>
          </section>

          {/* ── Full Workflow ── */}
          <section id="full-workflow">
            <span className="section-label section-label--green">Complete Example</span>
            <h2>Full Workflow</h2>
            <p>
              Here's everything combined into a single script. This is what a real evaluation run
              looks like end-to-end:
            </p>

            <CodeBlock code={fullWorkflowCode} language="python" fileName="full_evaluation.py" />

            <div className="tip-box">
              <strong>What happens after evaluation?</strong>
              Results are automatically uploaded to your Confident AI dashboard where you can:
              view pass/fail for each test case, see individual metric scores, compare results
              across runs, and identify which questions your RAG struggles with most.
            </div>

            <h3>Key Takeaways</h3>
            <ul>
              <li><strong>Golden datasets</strong> define what "correct" looks like — store them in Confident AI</li>
              <li><strong>2 + 2 pattern</strong>: goldens provide input + expected_output; RAG provides actual_output + context</li>
              <li><strong>Built-in metrics</strong> cover common dimensions: relevancy, hallucination, faithfulness</li>
              <li><strong>GEval</strong> lets you create custom metrics with plain English criteria</li>
              <li><strong>LLM-as-judge</strong> (GPT-4o) evaluates quality — no manual scoring needed</li>
              <li><strong>Track over time</strong> in Confident AI to catch regressions early</li>
            </ul>
          </section>

          {/* ── Recommended Courses ── */}
          <section id="recommended-courses" className="recommended-courses">
            <h2>Recommended Courses</h2>
            <p>Go deeper into AI testing with this hand-picked course.</p>
            <div className="recommended-courses__card">
              <div className="recommended-courses__card-body">
                <span className="section-label section-label--purple">Udemy Course</span>
                <h3 className="recommended-courses__card-title">AI Testing: DeepEval, RAGAS & Ollama</h3>
                <p className="recommended-courses__card-desc">
                  Master testing and evaluating AI applications and LLMs. Covers DeepEval,
                  RAGAS, Confident AI, local LLMs with Ollama, RAG testing, AI agent evaluation,
                  and hands-on projects with real-world scenarios.
                </p>
                <a
                  href="https://trk.udemy.com/4aeZq0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recommended-courses__btn"
                >
                  View Course on Udemy <FiExternalLink size={16} />
                </a>
              </div>
            </div>
          </section>

          {/* ── Mark as Complete ── */}
          <div className="mark-complete-section">
            {isCompleted ? (
              <div className="mark-complete-done">
                <FiAward size={24} />
                <span>You've completed this module!</span>
              </div>
            ) : (
              <button className="mark-complete-btn" onClick={() => markPageComplete('aiEval')}>
                <FiCheckCircle size={20} />
                Mark as Complete
              </button>
            )}
          </div>

        </article>

        <aside className="page-sidebar">
          <Navigation sections={sections} />
        </aside>
      </div>
    </div>
  );
}

export default AIEval;

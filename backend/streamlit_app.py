import streamlit as st
import pandas as pd
import gdown
import pickle
from pathlib import Path

# =========================
# 🎬 AIHub Movie Recommender
# =========================
st.set_page_config(page_title="🎬 AIHub - Movie Recommendation", layout="centered")

st.title("🎬 AIHub — Movie Recommendation System")
st.write("Enter a movie title below and get AI-powered recommendations!")

# =========================
# 📦 Google Drive File IDs (your actual files)
# =========================
MOVIES_PKL_ID = "1hmDviByo0HOYWb21GXkQyxRDpfIS-gGg"
SIM_PKL_ID = "1LqL-A-hNiKD-wBuWhetFQDgWNwd_jqe6"

# =========================
# 📁 Local Paths
# =========================
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

MOVIES_PKL_PATH = DATA_DIR / "movies.pkl"
SIM_PKL_PATH = DATA_DIR / "similarity.pkl"

# =========================
# 🧩 Helper Functions
# =========================
def download_from_gdrive(file_id, output_path):
    """Download file from Google Drive if not exists."""
    if not output_path.exists():
        url = f"https://drive.google.com/uc?id={file_id}"
        st.info(f"📥 Downloading `{output_path.name}` from Google Drive...")
        gdown.download(url, str(output_path), quiet=False)
        st.success(f"✅ Downloaded {output_path.name}")

@st.cache_data(show_spinner=True)
def load_pickle_data():
    """Load the precomputed movies and similarity model."""
    # Ensure files are downloaded
    download_from_gdrive(MOVIES_PKL_ID, MOVIES_PKL_PATH)
    download_from_gdrive(SIM_PKL_ID, SIM_PKL_PATH)

    with open(MOVIES_PKL_PATH, "rb") as f:
        movies = pickle.load(f)

    with open(SIM_PKL_PATH, "rb") as f:
        similarity = pickle.load(f)

    return movies, similarity


# =========================
# 🚀 Load data safely
# =========================
try:
    movies, similarity = load_pickle_data()
    st.success("✅ Movie data and similarity matrix loaded successfully!")
except Exception as e:
    st.error(f"❌ Error loading data: {e}")
    st.stop()

# =========================
# 🔎 Search Section
# =========================
st.markdown("---")
st.subheader("🔍 Search for a Movie")

query = st.text_input("Enter movie title (e.g., Iron Man):")

if st.button("🎥 Recommend"):
    if not query.strip():
        st.warning("Please enter a valid movie title.")
    else:
        matches = movies[movies['title'].str.contains(query, case=False, na=False)]

        if matches.empty:
            st.error("No movies found with that name. Try another title.")
        else:
            # Take first matched movie
            idx = matches.index[0]
            sim_scores = list(enumerate(similarity[idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6]

            st.markdown("---")
            st.subheader(f"🎞️ Recommended Movies for **{matches.iloc[0]['title']}**")

            for i, score in sim_scores:
                rec = movies.iloc[i]
                title = rec.get('title', 'Unknown Title')
                overview = rec.get('overview', '')[:250]
                st.markdown(
                    f"""
                    **🎬 {title}**  
                    ⭐ *Similarity:* {score:.2f}  
                    📝 *Overview:* {overview}...
                    """
                )

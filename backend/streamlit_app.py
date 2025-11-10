# streamlit_app.py
import streamlit as st
from pathlib import Path
import os
import gdown
import pickle

st.set_page_config(page_title="AIHub", layout="wide")

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

# Example: download precomputed pickles (only if not present)
def download_if_missing(drive_id, out_path):
    url = f"https://drive.google.com/uc?export=download&id={drive_id}"
    if not out_path.exists():
        st.info(f"Downloading {out_path.name} ...")
        gdown.download(url, str(out_path), quiet=False)

@st.cache_data(show_spinner=False)
def load_movies_and_similarity(movies_pkl, sim_pkl):
    # cached so repeated calls don't reload from disk
    with open(movies_pkl, "rb") as f:
        movies = pickle.load(f)
    with open(sim_pkl, "rb") as f:
        similarity = pickle.load(f)
    return movies, similarity

st.title("AIHub — Movie Rec + OCR + TextGen Demo")

# Use secrets for Drive file IDs (set them on Streamlit Cloud)
movies_pkl_id = st.secrets.get("MOVIES_PKL_ID")
sim_pkl_id = st.secrets.get("SIM_PKL_ID")

if movies_pkl_id and sim_pkl_id:
    movies_pkl = DATA_DIR / "movies.pkl"
    sim_pkl = DATA_DIR / "similarity.pkl"
    if not movies_pkl.exists() or not sim_pkl.exists():
        download_if_missing(movies_pkl_id, movies_pkl)
        download_if_missing(sim_pkl_id, sim_pkl)
    movies, similarity = load_movies_and_similarity(movies_pkl, sim_pkl)
    st.success("Loaded movie model")
else:
    st.warning("Set MOVIES_PKL_ID and SIM_PKL_ID in Streamlit Secrets")

# Simple UI example
query = st.text_input("Search movie title")
if st.button("Recommend"):
    if query:
        # example: find first matching index
        matches = movies[movies['title'].str.contains(query, case=False, na=False)]
        if len(matches) == 0:
            st.write("No match found")
        else:
            idx = matches.index[0]
            sims = list(enumerate(similarity[idx]))
            sims = sorted(sims, key=lambda x: x[1], reverse=True)[1:11]
            st.write("Recommendations:")
            for i, score in sims:
                r = movies.iloc[i]
                st.write(f"- **{r['title']}** ({r.get('release_date','')}) — {r.get('vote_average', '')}")

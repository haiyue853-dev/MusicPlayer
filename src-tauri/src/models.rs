use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Track {
    pub id: String,
    pub path: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: u32,
    pub cover: Option<String>,
    #[serde(rename = "lrcPath")]
    pub lrc_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub theme: String,
    pub volume: f32,
    pub last_scan_dir: Option<String>,
}

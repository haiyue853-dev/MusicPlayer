use crate::models::AppSettings;
use std::fs;
use std::path::PathBuf;

fn settings_path() -> PathBuf {
    let base = std::env::var("APPDATA").unwrap_or_else(|_| ".".into());
    let dir = PathBuf::from(base).join("MusicPlayer");
    let _ = fs::create_dir_all(&dir);
    dir.join("settings.json")
}

#[tauri::command]
pub async fn load_settings() -> Result<AppSettings, String> {
    let path = settings_path();
    if !path.exists() {
        return Ok(AppSettings {
            theme: "light".into(),
            volume: 0.8,
            last_scan_dir: None,
        });
    }

    let text = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str::<AppSettings>(&text).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn save_settings(settings: AppSettings) -> Result<(), String> {
    let path = settings_path();
    let json = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}

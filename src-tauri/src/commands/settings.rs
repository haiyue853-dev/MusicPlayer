use crate::models::AppSettings;

#[tauri::command]
pub async fn load_settings() -> Result<AppSettings, String> {
    Ok(AppSettings {
        theme: "light".into(),
        volume: 0.8,
        last_scan_dir: None,
    })
}

#[tauri::command]
pub async fn save_settings(settings: AppSettings) -> Result<(), String> {
    let _ = settings;
    Ok(())
}

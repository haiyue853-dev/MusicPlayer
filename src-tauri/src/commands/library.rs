use crate::models::Track;

#[tauri::command]
pub async fn scan_library(_dir: String) -> Result<Vec<Track>, String> {
    Ok(vec![])
}

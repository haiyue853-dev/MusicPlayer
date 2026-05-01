use crate::models::Track;

pub fn filter_supported(files: Vec<&str>) -> Vec<&str> {
    files
        .into_iter()
        .filter(|f| {
            ["mp3", "flac", "wav", "m4a"]
                .iter()
                .any(|ext| f.to_lowercase().ends_with(ext))
        })
        .collect()
}

#[tauri::command]
pub async fn scan_library(_dir: String) -> Result<Vec<Track>, String> {
    Ok(vec![])
}

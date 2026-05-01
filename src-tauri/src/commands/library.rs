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

#[cfg(test)]
mod tests {
    use super::filter_supported;

    #[test]
    fn scan_filters_supported_audio_extensions() {
        let files = vec!["a.mp3", "b.flac", "c.wav", "d.txt"];
        let out = filter_supported(files);
        assert_eq!(out, vec!["a.mp3", "b.flac", "c.wav"]);
    }
}

#[tauri::command]
pub async fn scan_library(_dir: String) -> Result<Vec<Track>, String> {
    Ok(vec![])
}

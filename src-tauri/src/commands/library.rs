use crate::models::Track;
use std::fs;
use std::path::{Path, PathBuf};

fn is_supported(path: &Path) -> bool {
    path.extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| matches!(ext.to_lowercase().as_str(), "mp3" | "flac" | "wav" | "m4a"))
        .unwrap_or(false)
}

fn collect_audio_files(dir: &Path, out: &mut Vec<PathBuf>) {
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                collect_audio_files(&path, out);
            } else if is_supported(&path) {
                out.push(path);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::is_supported;
    use std::path::Path;

    #[test]
    fn scan_filters_supported_audio_extensions() {
        assert!(is_supported(Path::new("a.mp3")));
        assert!(is_supported(Path::new("b.flac")));
        assert!(is_supported(Path::new("c.wav")));
        assert!(!is_supported(Path::new("d.txt")));
    }
}

#[tauri::command]
pub async fn scan_library(dir: String) -> Result<Vec<Track>, String> {
    let root = PathBuf::from(&dir);
    if !root.exists() || !root.is_dir() {
        return Err("目录不存在或不可访问".into());
    }

    let mut files = Vec::new();
    collect_audio_files(&root, &mut files);

    let tracks = files
        .into_iter()
        .map(|path| {
            let file_stem = path
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("Unknown")
                .to_string();
            let path_str = path.to_string_lossy().replace('\\', "/");
            Track {
                id: path_str.to_lowercase(),
                path: path_str,
                title: file_stem,
                artist: "Unknown".into(),
                album: "Unknown".into(),
                duration: 0,
                cover: None,
                lrc_path: None,
            }
        })
        .collect();

    Ok(tracks)
}

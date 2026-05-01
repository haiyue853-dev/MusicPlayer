use std::fs;
use std::path::PathBuf;

#[test]
fn settings_file_roundtrip() {
    let temp = std::env::temp_dir().join("music_player_settings_test.json");
    let data = r#"{"theme":"dark","volume":0.6,"last_scan_dir":"D:/Music"}"#;
    fs::write(&temp, data).unwrap();
    let read_back = fs::read_to_string(&temp).unwrap();
    assert_eq!(read_back, data);
    let _ = fs::remove_file(PathBuf::from(temp));
}

#[path = "../src/commands/library.rs"]
mod library;

#[test]
fn scan_filters_supported_audio_extensions() {
    let files = vec!["a.mp3", "b.flac", "c.wav", "d.txt"];
    let out = library::filter_supported(files);
    assert_eq!(out, vec!["a.mp3", "b.flac", "c.wav"]);
}

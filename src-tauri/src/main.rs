#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod models;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::library::scan_library,
            commands::settings::load_settings,
            commands::settings::save_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}

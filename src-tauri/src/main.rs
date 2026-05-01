#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod models;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::library::scan_library])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}

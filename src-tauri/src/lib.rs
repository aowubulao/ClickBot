mod keyboard;

use keyboard::{run_keyboard, stop_keyboard, support_key_list};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![run_keyboard, stop_keyboard, support_key_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

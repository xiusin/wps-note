#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

    // tauri::Builder::default()
    // .setup(|app| {
    //    let win = app.get_window("main").unwrap();
    //    Ok(())
    // })
    // .run(tauri::generate_context!())
    // .expect("error while running tauri application");
}

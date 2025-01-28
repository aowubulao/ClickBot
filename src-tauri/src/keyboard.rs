use enigo::Direction::Click;
use enigo::{Enigo, Key, Keyboard, Settings};
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::time::Duration;

#[derive(Serialize, Deserialize)]
pub struct LineInfo {
  id: String,
  key: String,
  interval: u64,
  enable: bool,
}

static IS_RUNNING: AtomicBool = AtomicBool::new(false);
lazy_static! {
    static ref KEY_MAP: HashMap<&'static str, Key> = {
        let mut map = HashMap::new();
        map.insert("ENTER", Key::Return);
        map.insert("SHIFT", Key::Shift);
        map.insert("CTRL", Key::Control);
        map.insert("CONTROL", Key::Control);
        map.insert("BACKSPACE", Key::Backspace);
        map.insert("META", Key::Meta);
        map.insert("WINDOWS", Key::Meta);
        map.insert("COMMAND", Key::Meta);
        map.insert("ALT", Key::Alt);
        map.insert("F1", Key::F1);
        map.insert("F2", Key::F2);
        map.insert("F3", Key::F3);
        map.insert("F4", Key::F4);
        map.insert("F5", Key::F5);
        map.insert("F6", Key::F6);
        map.insert("F7", Key::F7);
        map.insert("F8", Key::F8);
        map.insert("F9", Key::F9);
        map.insert("F10", Key::F10);
        map.insert("F11", Key::F11);
        map.insert("F12", Key::F12);
        map.insert("F13", Key::F13);
        map.insert("F14", Key::F14);
        map.insert("F15", Key::F15);
        map.insert("F16", Key::F16);
        map.insert("F17", Key::F17);
        map.insert("F18", Key::F18);
        map.insert("F19", Key::F19);
        map.insert("F20", Key::F20);
        map.insert("SPACE", Key::Space);
        map.insert("TAB", Key::Tab);
        map.insert("ARROWUP", Key::UpArrow);
        map.insert("ARROWDOWN", Key::DownArrow);
        map.insert("ARROWLEFT", Key::LeftArrow);
        map.insert("ARROWRIGHT", Key::RightArrow);
        // #[cfg(target_os = "windows")]
        // insert_windows_key(&mut map);
        map
    };
}
// #[cfg(target_os = "windows")]
// fn insert_windows_key(map: &mut HashMap<&'static str, Key>) {
//   for c in b'A'..=b'Z' {
//     let key = (c as char).to_string();
//     map.insert(Box::leak(key.into_boxed_str()), Key::from(c as char));
//   }
// }

#[tauri::command]
pub fn run_keyboard(line_list: Vec<LineInfo>) {
  if IS_RUNNING.load(Ordering::SeqCst) {
    return;
  }
  IS_RUNNING.store(true, Ordering::SeqCst);
  for line in line_list {
    if !line.enable {
      continue;
    }
    let key = line.key.clone();
    let interval = line.interval;
    if let Some(click_key) = KEY_MAP.get(key.as_str()) {
      thread::spawn(move || {
        let mut enigo = Enigo::new(&Settings::default()).unwrap();
        while IS_RUNNING.load(Ordering::SeqCst) {
          enigo.key(*click_key, Click).expect("panic click");
          thread::sleep(Duration::from_millis(interval));
        }
      });
    }
  }
}

#[tauri::command]
pub fn stop_keyboard() {
  IS_RUNNING.store(false, Ordering::SeqCst);
}

#[tauri::command]
pub fn support_key_list() -> Vec<&'static str> {
  KEY_MAP.keys().cloned().collect()
}

"""
mock_iot_sensor.py — Simulator Sensor IoT Eksternal (Mocking NodeMCU / ESP32)
Jalankan script ini untuk menyimulasikan sensor jarak (Ultrasonic) atau tombol pemicu IoT.
"""
import time
import json
import random
import paho.mqtt.client as mqtt

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC_TRIGGER = "bridgecom/sensor/trigger"
TOPIC_GESTURE = "bridgecom/gesture/detected"

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"[Simulator Node] ✅ Terhubung ke MQTT Broker ({MQTT_BROKER}:{MQTT_PORT})")
        # Berlangganan hasil gesture yang dideteksi oleh backend AI
        client.subscribe(TOPIC_GESTURE)
        print(f"[Simulator Node] 🎧 Mendengarkan topik: {TOPIC_GESTURE}")
    else:
        print(f"[Simulator Node] ❌ Gagal terhubung, kode: {rc}")

def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    print(f"\n📢 [IoT Actuator/Speaker Menerima]: Gesture '{data.get('gesture')}' terdeteksi! (Confidence: {data.get('confidence')*100:.1f}%)")

def run_simulator():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="esp32-node-simulator")
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        client.loop_start()

        print("="*60)
        print("🤖 SIMULATOR SENSOR IoT (ESP32/PIR Presence Node)")
        print("Tekan Ctrl+C untuk berhenti")
        print("="*60)

        counter = 1
        while True:
            # Kirim event sensor keberadaan orang setiap 10 detik
            simulated_distance_cm = round(random.uniform(20.0, 80.0), 1)
            payload = {
                "sensor_node": "esp32-room-01",
                "distance_cm": simulated_distance_cm,
                "presence_detected": simulated_distance_cm < 50.0,
                "msg_id": counter,
                "timestamp": time.time()
            }
            client.publish(TOPIC_TRIGGER, json.dumps(payload), qos=1)
            print(f"[Simulator Node] 📤 Mengirim data sensor: {payload}")
            counter += 1
            time.sleep(10)

    except KeyboardInterrupt:
        print("\n[Simulator Node] Menghentikan simulasi...")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    run_simulator()

"""
mqtt_manager.py — IoT MQTT Telemetry & Event Bridge untuk BridgeCom
"""
import os
import json
import time
import paho.mqtt.client as mqtt

MQTT_BROKER = os.getenv("MQTT_BROKER_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_BROKER_PORT", "1883"))
MQTT_TOPIC_GESTURE = os.getenv("MQTT_TOPIC_GESTURE", "bridgecom/gesture/detected")
MQTT_TOPIC_STATUS = os.getenv("MQTT_TOPIC_STATUS", "bridgecom/device/status")
MQTT_TOPIC_SENSOR = os.getenv("MQTT_TOPIC_SENSOR", "bridgecom/sensor/trigger")

_client = None

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"[MQTT] ✅ Terhubung ke MQTT Broker: {MQTT_BROKER}:{MQTT_PORT}")
        client.subscribe(MQTT_TOPIC_SENSOR)
        publish_status("online")
    else:
        print(f"[MQTT] ⚠️ Gagal terhubung ke broker, kode: {rc}")

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode()
        print(f"[MQTT] 📩 Pesan diterima di [{msg.topic}]: {payload}")
    except Exception as e:
        print(f"[MQTT] Error parsing pesan: {e}")

def init_mqtt():
    global _client
    try:
        _client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=f"bridgecom-backend-{int(time.time())}")
        _client.on_connect = on_connect
        _client.on_message = on_message
        
        # Connect non-blocking
        _client.connect_async(MQTT_BROKER, MQTT_PORT, keepalive=60)
        _client.loop_start()
        return _client
    except Exception as e:
        print(f"[MQTT] ⚠️ Inisialisasi MQTT dilewati / gagal: {e}")
        return None

def publish_gesture(gloss: str, confidence: float):
    global _client
    if _client and _client.is_connected():
        payload = {
            "device_id": "bridgecom-node-01",
            "gesture": gloss,
            "confidence": round(float(confidence), 2),
            "timestamp": time.time()
        }
        _client.publish(MQTT_TOPIC_GESTURE, json.dumps(payload), qos=1)

def publish_status(status_str: str):
    global _client
    if _client and _client.is_connected():
        payload = {
            "device_id": "bridgecom-node-01",
            "status": status_str,
            "timestamp": time.time()
        }
        _client.publish(MQTT_TOPIC_STATUS, json.dumps(payload), qos=1, retain=True)

def stop_mqtt():
    global _client
    if _client:
        publish_status("offline")
        _client.loop_stop()
        _client.disconnect()
        _client = None

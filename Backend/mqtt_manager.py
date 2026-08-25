"""
mqtt_manager.py — IoT MQTT Telemetry & Event Bridge untuk BridgeCom
"""
import os
import json
import time
import paho.mqtt.client as mqtt

DEVICE_ID = os.getenv("DEVICE_ID", "bridgecom-node-01")
MQTT_BROKER = os.getenv("MQTT_BROKER_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_BROKER_PORT", "1883"))
MQTT_TOPIC_GESTURE = os.getenv("MQTT_TOPIC_GESTURE", f"bridgecom/{DEVICE_ID}/gesture")
MQTT_TOPIC_STATUS = os.getenv("MQTT_TOPIC_STATUS", f"bridgecom/{DEVICE_ID}/status")
MQTT_TOPIC_SENSOR = os.getenv("MQTT_TOPIC_SENSOR", f"bridgecom/{DEVICE_ID}/sensor")

_client = None

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"[MQTT] ✅ Terhubung ke MQTT Broker: {MQTT_BROKER}:{MQTT_PORT} (Node: {DEVICE_ID})")
        client.subscribe(MQTT_TOPIC_SENSOR)
        publish_status("online")
    else:
        print(f"[MQTT] ⚠️ Gagal terhubung ke broker, kode: {rc}")

def on_message(client, userdata, msg):
    try:
        payload_str = msg.payload.decode("utf-8")
        try:
            data = json.loads(payload_str)
            print(f"[MQTT] 📩 JSON Sensor diterima di [{msg.topic}]: {data}")
        except json.JSONDecodeError:
            print(f"[MQTT] 📩 Raw Data diterima di [{msg.topic}]: {payload_str}")
    except Exception as e:
        print(f"[MQTT] Error parsing pesan MQTT: {e}")

def init_mqtt():
    global _client
    try:
        _client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2, 
            client_id=f"bridgecom-backend-{DEVICE_ID}-{int(time.time())}"
        )
        _client.on_connect = on_connect
        _client.on_message = on_message
        
        # Set Last Will and Testament (LWT) jika koneksi putus tiba-tiba
        lwt_payload = json.dumps({
            "device_id": DEVICE_ID,
            "status": "offline",
            "reason": "unexpected_disconnect",
            "timestamp": time.time()
        })
        _client.will_set(MQTT_TOPIC_STATUS, payload=lwt_payload, qos=1, retain=True)

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
        try:
            payload = {
                "device_id": DEVICE_ID,
                "gesture": gloss,
                "confidence": round(float(confidence), 2),
                "timestamp": time.time()
            }
            _client.publish(MQTT_TOPIC_GESTURE, json.dumps(payload), qos=1)
        except Exception as e:
            print(f"[MQTT] Gagal publish gesture: {e}")

def publish_status(status_str: str):
    global _client
    if _client and _client.is_connected():
        try:
            payload = {
                "device_id": DEVICE_ID,
                "status": status_str,
                "timestamp": time.time()
            }
            _client.publish(MQTT_TOPIC_STATUS, json.dumps(payload), qos=1, retain=True)
        except Exception as e:
            print(f"[MQTT] Gagal publish status: {e}")

def stop_mqtt():
    global _client
    if _client:
        try:
            publish_status("offline")
            _client.loop_stop()
            _client.disconnect()
        except Exception as e:
            print(f"[MQTT] Error stopping MQTT: {e}")
        _client = None

import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"
SESSION_ID = "aura-sync-test-002"
CANDIDATE_ID = "CAND-001"

def send_post(endpoint, payload):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"\n❌ HTTP ERROR {e.code}: {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return None

print("="*60)
print("🚀 BOOTING AURA SYNCHRONIZED DUAL-AGENT SYSTEM...")
print("="*60)

# 1. START THE INTERVIEW
start_payload = {"sessionId": SESSION_ID, "candidateId": CANDIDATE_ID}
print(f"\n[SYSTEM] Loading Candidate {CANDIDATE_ID}...")
start_res = send_post("/start", start_payload)

if not start_res:
    print("Failed to start session. Is the FastAPI server running?")
    exit()

print(f"✅ SUCCESS: Loaded target days: {start_res.get('targetDays')}")
print(f"\n🤖 AURA: {start_res.get('reply')}")

# 2. CHAT LOOP
while True:
    user_msg = input("\n👤 You: ")
    if user_msg.lower() in ['quit', 'exit']:
        break
        
    print("⏳ AURA is processing (Critic is grading...)")
    chat_res = send_post("/chat", {"sessionId": SESSION_ID, "message": user_msg})
    
    if chat_res:
        # Check if the interview just finished
        if chat_res.get("done"):
            print(f"\n🤖 AURA (Wrap-up): {chat_res.get('reply')}")
            break

        # Show off the Critic's hidden evaluation
        critic_data = chat_res.get("debug_critic", {})
        print("\n" + "-"*50)
        print(f"🔍 [CRITIC SCORE]: {critic_data.get('score')}/10 | {critic_data.get('reason')}")
        print("-" * 50)
        
        # Show the Dreamer's next question
        print(f"\n🤖 AURA: {chat_res.get('reply')}")

# 3. AUTO-GENERATE FEEDBACK REPORT
print("\n" + "="*60)
print("📊 INTERVIEW COMPLETE. GENERATING AURA FEEDBACK REPORT...")
print("="*60)

feedback_res = send_post("/feedback", {"sessionId": SESSION_ID})
if feedback_res:
    print(json.dumps(feedback_res, indent=2))
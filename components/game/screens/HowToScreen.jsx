"use client";
import { ROW_COLOR, COL_COLOR } from "@/lib/gameConfig";

export default function HowToScreen({ onBack }) {
  return (
    <div className="app-container">
      <div className="howto-wrap">
        <h2 className="howto-title">วิธีเล่น</h2>

        <div className="howto-steps">
          <div className="howto-step">
            <div className="sn">1</div>
            <div>
              <strong>อ่านโจทย์</strong> — ได้พหุนาม 2 วงเล็บคูณกัน โดย
              <span style={{ color: ROW_COLOR, fontWeight: 700 }}> วงเล็บแรก</span> จะเป็นสีแดง และ
              <span style={{ color: COL_COLOR, fontWeight: 700 }}> วงเล็บสอง</span> จะเป็นสีน้ำเงิน
            </div>
          </div>

          <div className="howto-step">
            <div className="sn">2</div>
            <div>
              <strong>ใส่สัมประสิทธิ์</strong> — กรอกตัวเลขจากโจทย์ลงในหัวแถว (
              <span style={{ color: ROW_COLOR }}>■ แดง</span>) และหัวคอลัมน์ (
              <span style={{ color: COL_COLOR }}>■ น้ำเงิน</span>)
            </div>
          </div>

          <div className="howto-step">
            <div className="sn">3</div>
            <div>
              <strong>คูณในตาราง</strong> — คูณสัมประสิทธิ์แต่ละคู่ กรอกตัวเลข
              (ระบบใส่ x, x² ให้อัตโนมัติ)
            </div>
          </div>

          <div className="howto-step">
            <div className="sn">4</div>
            <div>
              <strong>รวมแนวทแยง + ตอบ</strong> — ตารางมาร์คสีแนวทแยง บวกพจน์สีเดียวกัน แล้วกรอกคำตอบ!
            </div>
          </div>
        </div>

        <button className="back-btn" onClick={onBack}>← กลับเมนู</button>
      </div>
    </div>
  );
}

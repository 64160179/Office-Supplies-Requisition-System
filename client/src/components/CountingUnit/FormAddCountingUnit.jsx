import React from 'react'
import { useNavigate } from "react-router-dom";

const FormAddCountingUnit = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    // รีเซ็ตสถานะของฟอร์ม

    // ย้อนกลับไปหน้า /users
    navigate('/countingunits');
  };

  return (
    <div>
      <br />
      <h1 className="title">เพิ่มหน่วยนับใหม่</h1>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form >
              {/* <p className="has-text-centered" style={{ color: 'red' }}>{msg}</p> */}
              <div className="field">
                <label className="label">ชื่อหน่วยนับ</label>
                <div className="control">
                  <input className="input"
                    type="text"
                    placeholder="กรุณากรอกชื่อหน่วยนับ"
                  />
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button type="submit" className="button is-success" style={{ width: "120px" }}>
                    บันทึกข้อมูล
                  </button>
                </div>
                <div className="control">
                  <button type="button" onClick={handleCancel} className="button is-danger" style={{ width: "120px" }}>
                    ยกเลิก
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormAddCountingUnit
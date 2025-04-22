import React, { useState } from "react";
import DrStyle from "../css/DriverRegistration.module.css";
import { Button } from "antd";

function DriverRegistration() {
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <>
      <div className={DrStyle.content}>
        <div className={DrStyle.DR_top}>기사 등록</div>
        <div className={`${DrStyle.DR_main} card`}>
          <div className={DrStyle.MainTop}>
            <h3>기사 등록</h3>
            <Button type="primary">목록</Button>
          </div>
          <form className={DrStyle.DriverForm}>
            <div className={DrStyle.Form}>
              <div className={DrStyle.FormLeft}>
                <div className={DrStyle.imge}>
                  {previewImage ? (
                    <div className={DrStyle.preview}>
                      <img src={previewImage} alt="미리보기" width="150" />
                    </div>
                  ) : (
                    <div className={DrStyle.nopreview}>
                      등록된 사진이 없습니다.
                    </div> // 이미지가 없을 경우 문구 출력
                  )}
                  <div style={{ width: "165px", overflow: "visible" }}>
                    <input type="file" onChange={handleImageChange} />
                  </div>
                </div>
                <div className={`${DrStyle.Group} ${DrStyle.name}`}>
                  <label htmlFor="name">이름</label>
                  <input type="text" />
                </div>
                <div className={`${DrStyle.Group} ${DrStyle.name}`}>
                  <label htmlFor="phone">연락처</label>
                  <input type="number" />
                </div>
                <div className={`${DrStyle.Group} ${DrStyle.email}`}>
                  <label htmlFor="email">이메일</label>
                  <input type="email" />
                </div>
                <div className={`${DrStyle.Group} ${DrStyle.address}`}>
                  <label htmlFor="address">주소</label>
                  <input type="text" />
                </div>
              </div>
            </div>
            <div className={`${DrStyle.Group} ${DrStyle.memo}`}>
              <label htmlFor="memo">메모</label>
              <textarea name="memo" id=""></textarea>
            </div>
            <div className={`${DrStyle.Group} ${DrStyle.file}`}>
              <label htmlFor="address">첨부파일</label>
              <input type="file" />
            </div>
            <div className="btn-container">
              <button type="button" className="btn btn-back btn-standard">
                뒤로가기
              </button>
              <button className="btn btn-add btn-standard" type="submit">
                {"등록하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DriverRegistration;

import React, { useState } from "react";
import DrStyle from "../../css/DriverRegistration.module.css";
import { Button } from "antd";
import { supabase } from "../../lib/supabase.js";
import { useNavigate } from "react-router-dom";

const uploadFileToStorage2 = async (folder, file) => {
  const fileName = `${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(`${folder}/${fileName}`, file);

  if (error) {
    console.error("업로드 실패:", error.message);
    return null;
  }


  const { publicUrl } = supabase.storage
    .from("images")
    .getPublicUrl(`${folder}/${fileName}`).data;

  return publicUrl;
};


function DriverRegistration() {
  const navigate2 = useNavigate();
  const [previewImage2, setPreviewImage2] = useState(null);
  const [photoFile2, setPhotoFile2] = useState(null);
  const [attachFile2, setAttachFile2] = useState(null);


  const [formData2, setFormData2] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    memo: "",
    photo_url: "",
    file_url: ""
  });

  const handleImageChange2 = (e) => {
    const file2 = e.target.files[0];
    if (file2) {
      const photoUrl2 = URL.createObjectURL(file2);
      setPreviewImage2(photoUrl2);
      setPhotoFile2(file2);
    }
  };

  const handleAttachFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachFile2(file);
    }
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    let photoUrl = "";
    if (photoFile2) {
      photoUrl = await uploadFileToStorage2("Driver-photo", photoFile2);
    }

    let fileUrl = "";
    if (attachFile2) {
      fileUrl = await uploadFileToStorage2("Driver-file", attachFile2);
    }

    const { error } = await supabase.from("DriverList").insert([{
      ...formData2,
      photo_url: photoUrl,
      file_url: fileUrl
    }]);

    if (error) {
      alert("등록 실패: " + error.message);
    } else {
      alert("등록 완료!");
      navigate2("/DriverList");
    }
  };

  const goToDriverList = () => {
    navigate2("/DriverList");
  };

  return (
    <>
      <div className={DrStyle.content}>
        <div className={DrStyle.DR_top}>기사 관리</div>
        <div className={`${DrStyle.DR_main} card`}>
          <div className={DrStyle.MainTop}>
            <h3>기사 등록</h3>
            <Button type="primary" onClick={goToDriverList}>목록</Button>
          </div>
          <form className={DrStyle.DriverForm} onSubmit={handleSubmit2}>
            <div className={DrStyle.FormUp}>
              <div className={DrStyle.imge}>
                {previewImage2 ? (
                  <div className={DrStyle.preview}>
                    <img src={previewImage2} alt="미리보기" width="150" />
                  </div>
                ) : (
                  <div className={DrStyle.nopreview}>
                    등록된 사진이 없습니다.
                  </div>
                )}
                <div style={{ width: "150px", overflow: "visible" }}>
                  <input type="file" onChange={handleImageChange2} />
                </div>
              </div>
              <div className={DrStyle.formright}>
                <div className={`${DrStyle.Group} ${DrStyle.name}`}>
                  <label htmlFor="name">이름</label>
                  <input type="text" name="name" onChange={handleChange2} />
                </div>
                <div className={`${DrStyle.Group} ${DrStyle.name}`}>
                  <label htmlFor="phone">연락처</label>
                  <input type="number" name="phone" onChange={handleChange2} />
                </div>
                <div className={`${DrStyle.Group} ${DrStyle.email}`}>
                  <label htmlFor="email">이메일</label>
                  <input type="email" name="email" onChange={handleChange2} />
                </div>
              </div>
            </div>
            <div className={`${DrStyle.Group} ${DrStyle.address}`}>
              <label htmlFor="address">주소</label>
              <input type="text" name="address" onChange={handleChange2} />
            </div>
            <div className={`${DrStyle.Group} ${DrStyle.memo}`}>
              <label htmlFor="memo">메모</label>
              <textarea name="memo" onChange={handleChange2}></textarea>
            </div>
            <div className={`${DrStyle.Group} ${DrStyle.file}`}>
              <label htmlFor="file_url">첨부파일</label>
              <input type="file" onChange={handleAttachFileChange2} />
            </div>
            <div className="btn-container">
              <button type="button" className="btn btn-back btn-standard"  onClick={goToDriverList}>
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

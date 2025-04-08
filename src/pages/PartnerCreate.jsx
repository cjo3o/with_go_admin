import React, {useRef, useState} from 'react';
import {supabase} from "../lib/supabase.js";
import '../css/partnerCreate.css';

function PartnerCreate() {
    const [form, setForm] = useState({
        name: '',
        address: '',
        phone: '',
        map_url: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    // 구글맵 지도퍼가기 src 추출
    const extractSrc = (iframeString) => {
        const match = iframeString.match(/src="([^"]+)"/);
        return match ? match[1] : iframeString;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, address, phone, map_url} = form;

        // 필수 입력 체크
        if (!name || !address || !phone || !map_url || !imageFile) {
            alert('모두 다 입력해야 합니다.');
            return;
        }

        const cleanMapUrl = extractSrc(map_url);
        let image = '';

        if (imageFile) {
            const fileExt = imageFile.name.split(".").pop().toLowerCase();
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

            if (!allowedExtensions.includes(fileExt)) {
                alert("지원되지 않는 파일 형식입니다.\njpg, jpeg, png, gif, bmp 파일만 업로드 가능합니다.");
                return;
            }

            const fileName = crypto.randomUUID() + "." + fileExt;
            const filePath = `partner_img/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, imageFile);

            if (uploadError) {
                alert('파일 업로드 중 오류가 발생했습니다.');
                console.error(uploadError);
                return;
            }

            const { data: publicUrl } = supabase.storage
                .from("images")
                .getPublicUrl(filePath);

            image = publicUrl.publicUrl;
        }

        const { error } = await supabase
            .from('partner')
            .insert([{
                name,
                address,
                phone,
                map_url: cleanMapUrl,
                image
            }]);

        if (error) {
            console.error('등록 오류:', error);
            alert('등록 중 오류가 발생했습니다.');
        } else {
            alert('등록이 완료되었습니다!');
            setForm({
                name: '',
                address: '',
                phone: '',
                map_url: '',
            });
            setImageFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className='main'>
            <div className='header'>제휴숙소관리</div>
            <div className='card'>
                <h3>제휴숙소등록</h3>
                <form onSubmit={handleSubmit} className='form_Create'>
                    <div className='group'>
                        <label className='name'>숙소명</label>
                        <input
                            type="text"
                            name="name"
                            autoComplete="off"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='group'>
                        <label className='address'>주소</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='group'>
                        <label className='phone'>연락처</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='group'>
                        <label className='map'>지도</label>
                        <input
                            type="text"
                            name="map_url"
                            value={form.map_url}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='group'>
                        <label className='img'>숙소 이미지</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </div>
                    <div className='btn-container'>
                        <button className='btn' type="submit">등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PartnerCreate;
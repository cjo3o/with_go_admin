import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import supabase from "../lib/supabase.js";
import Swal from "sweetalert2"; // 추가

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const type = searchParams.get("type");

    // 결제 시 localStorage에 값 저장해뒀던 걸 꺼냄
    const formData = JSON.parse(localStorage.getItem("reservation_data"));
    if (!formData) {
      // 에러 처리
      return;
    }

    async function insertData() {
      try {
        if (type === "storage") {
          await supabase.from("storage").insert([formData]);
        } else {
          await supabase.from("delivery").insert([formData]);
        }
        localStorage.removeItem("reservation_data");
        // SweetAlert 띄우고, 확인 누르면 이동
        Swal.fire({
          title: "결제 완료",
          text: "정상적으로 결제가 완료되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        }).then(() => {
          navigate("/ApplicationList");
        });
      } catch (err) {
        alert("저장 오류:" + err.message);
      }
    }

    insertData();
  }, [searchParams, navigate]);

  return;
}

export default PaymentSuccessPage;

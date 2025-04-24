import React from "react";
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Addicon from '@mui/icons-material/Add';

const FloatingBtn = ({ onClick }) => {
    return (
        <Box>
            <Fab
                variant="extended"
                color="primary"
                onClick={onClick} // ✅ 클릭 시 다운로드 실행
                sx={{
                    height: '40px',
                    minHeight: '40px',
                    lineHeight: '40px',
                    padding: '0 16px',
                    borderRadius: '5px',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#1677ff', // 선택사항
                    boxShadow: 'none !important',   // 💥 완전 강제
                    '&:hover': {
                        boxShadow: 'none !important', // 💥 호버 시에도 강제
                        backgroundColor: '#1677ff',   // 호버 시 색 유지
                    },
                    '&.MuiFab-root': {
                        boxShadow: 'none !important',
                    },
                }}
            >
                <Addicon sx={{ mr: 1 }} />
                Excel 다운로드
            </Fab>
        </Box>
    );
};

export default FloatingBtn
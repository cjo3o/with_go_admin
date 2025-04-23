import React from "react";
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Addicon from '@mui/icons-material/Add';

const FloatingBtn = () => {
    return (
        <Box
            sx={{
                // float: 'right'
                // right: 0
                // borderRadius: '5px',
            }}
        >
            <Fab
                variant="extended"
                color="primary"
                style={{height: '40px',
                    borderRadius: '5px',
                    zIndex: 1,
                }}>
                <Addicon sx={{mr: 1}}/>
                Excel 다운로드
            </Fab>
        </Box>
    );
}

export default FloatingBtn
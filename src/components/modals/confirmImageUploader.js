import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box } from '@mui/system';
import { DialogTitle, Radio } from '@mui/material';
import './index.css'

const ConfirmImageUploader = ({
    confirmation, handleClose, thumbnails, formik, coverImage, setCoverImage, handleSubmitCoverImage, propertyId
}) => {
    const imagesList = thumbnails && thumbnails[0]?.images?.length
    return (
        <div>
            <Dialog
                maxWidth="lg"
                fullWidth={true}
                open={confirmation}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Seelct an cover photo</DialogTitle>
                <DialogContent sx={{ display: "flex", flexWrap: 'wrap' }}>
                    {(formik?.values?.cover_image && imagesList > 0) &&
                        <Box className='image___container' onClick={(e) => setCoverImage(formik?.values?.cover_image)}>
                            <Box className='image___container__radio'>
                                <Radio checked={formik?.values?.cover_image === coverImage}
                                    value={formik?.values?.cover_image}
                                    size='small'
                                    className='image___container___radio__button'
                                />
                            </Box>
                            <Box width='200px' height='200px' component={'img'} src={formik?.values?.cover_image} alt='product_img' />
                        </Box>
                    }
                    {imagesList > 0 && thumbnails?.map((loop1) => {
                        return (loop1?.images?.map((loopImage) => {
                            return <Box key={loopImage} className='image___container' onClick={(e) => setCoverImage(loopImage)}>
                                <Box className='image___container__radio'>
                                    <Radio checked={coverImage === loopImage}
                                        value={loopImage}
                                        size='small'
                                        className='image___container___radio__button'
                                    />
                                </Box>
                                <Box width='200px' height='200px' component={'img'} src={loopImage} alt='product_img' />
                            </Box>
                        }))
                    })}

                    {imagesList === 0 && <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Button
                            component="label"
                            variant="outlined"
                            sx={{ height: "40px" }}
                        >
                            + Add Image
                            <input
                                type="file"
                                name="images"
                                accept="image/*"
                                hidden
                                onChange={(e) => setCoverImage(e?.target?.files[0])}
                            />
                        </Button>
                        {coverImage && <Box
                            component={'img'}
                            src={
                                propertyId && typeof imageUrl === "string"
                                    ? `${coverImage}`
                                    : URL.createObjectURL(coverImage)
                            }
                            alt={`cover_image`}
                            className="preview-image"
                            width="100"
                            height="100"
                        />}
                    </Box>}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant='contained' onClick={handleClose}>Close</Button>
                    <Button variant='contained' onClick={handleSubmitCoverImage}>Add cover image</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ConfirmImageUploader
import { useState } from 'react';
import { Transition } from '@headlessui/react';

const ImageGallery = () => {

    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    // function for uploading images
    const handleFileChange = (e) => {
        const fileList = e.target.files;
        for (let i = 0; i < fileList.length; i++) {
            const reader = new FileReader();
            reader.onload = () => {
                setImages((prevState) => [...prevState, reader.result]);
            };
            reader.readAsDataURL(fileList[i]);
        }
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // function for drop and rearrange images
    const handleDrop = (e, currentIndex) => {
        e.preventDefault();
        const droppedImageIndex = e.dataTransfer.getData('text/plain');
        const newImages = [...images];
        const temp = newImages[droppedImageIndex];
        newImages[droppedImageIndex] = newImages[currentIndex];
        newImages[currentIndex] = temp;
        setImages(newImages);
    };

    // function for select and deselect image
    const handleSelectImage = (image) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter((selected) => selected !== image));
        } else {
            setSelectedImages([...selectedImages, image]);
        }
    };

    // function for deleting image
    const handleDeleteSelected = () => {
        const updatedImages = images.filter((image) => !selectedImages.includes(image));
        setImages(updatedImages);
        setSelectedImages([]);
    };

    return (
        <div className="container mx-auto p-4 bg-slate-50">

            {selectedImages.length === 0 && images.length > 0 && (
                <h2 className='p-2 font-bold text-xl'>Gallery</h2>
            )}
            
            <div className='flex items-center justify-between'>

                {/* conditional rendering for selected images */}
                {selectedImages.length > 0 && (
                    <div className="mt-4 flex items-center">
                        <div>
                            <p className='my-2'>
                                <span className='bg-blue-800 text-white rounded-full p-1 bold'>
                                    {selectedImages.length}
                                </span> <span className='font-bold'>Files selected</span>
                            </p>
                        </div>

                        {/* Button to delete selected images */}
                        <div className='md:ml-[1000px] ml-10'>
                            <p
                                className="px-4 py-2 text-red-500 rounded mt-2 cursor-pointer font-bold"
                                onClick={handleDeleteSelected}
                            >
                                Delete Files
                            </p>
                        </div>

                    </div>
                )}

            </div>

            <hr />

            {/* grid for displaying images */}
            <div className="mt-4 grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`relative group ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                        style={{ position: 'relative' }}
                    >

                        {/* displaying image */}
                        <img
                            src={image}
                            alt={`gallery-${index}`}
                            className={`cursor-pointer border rounded-md ${selectedImages.includes(image)
                                ? 'border-blue-500 rounded-md'
                                : 'border-gray-500'
                                } transition duration-300 ease-in-out transform hover:scale-105`}
                            onClick={() => handleSelectImage(image)}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            style={{ width: '100%', height: '100%' }}
                        />

                        {/* Transition for hover effect */}
                        <Transition
                            show={selectedImages.includes(image)}
                            enter="transition-opacity duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            {(ref) => (
                                <span
                                    ref={ref}
                                    className="absolute top-2 right-2 bg-blue-900 p-1 rounded-full text-white"
                                >
                                    {selectedImages.indexOf(image) + 1}
                                </span>
                            )}
                        </Transition>
                    </div>
                ))}

                {/* container for uploading images */}
                <div
                    className="relative group col-span-1 row-span-1"
                >
                    <label htmlFor="upload" className='w-full h-full'>
                        <input

                            type="file"
                            multiple
                            id="upload"
                            onChange={handleFileChange}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-full cursor-pointer h-full border rounded-md border-gray-300 flex items-center justify-center relative md:text-xl">
                            Upload Image
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;

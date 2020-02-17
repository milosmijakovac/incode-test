import React, { Component } from "react";
import Dropzone from "react-dropzone";

const imageMaxSize = 1000000000;
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map(item => {
  return item.trim();
});

class ImageDropFront extends Component {
  state = {
    imgSrcFront: null
  };

  verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert("This file is to big");
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("This file is not allowed. Only images are allowed");
        return false;
      }

      return true;
    }
  };

  handleOnDrop = (files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      // console.log(rejectedFiles);
      this.verifyFile(rejectedFiles);
    }

    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          "load",
          () => {
            this.setState({ imgSrcFront: myFileItemReader.result }, () => {
              this.props.handleImageFront(this.state.imgSrcFront);
            });
          },
          false
        );
        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };
  render() {
    const { imgSrcFront } = this.state;
    console.log(imgSrcFront);
    return (
      <Dropzone
        onDrop={this.handleOnDrop}
        maxSize={imageMaxSize}
        multiple={false}
        accept={acceptedFileTypes}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p className="front"></p>
              {imgSrcFront !== null ? <img src={imgSrcFront} alt="" /> : ""}
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default ImageDropFront;

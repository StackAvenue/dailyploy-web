import React, { Component } from "react";
import ImageUploader from "react-images-upload";
import onClickOutside from "react-onclickoutside";
import Loader from "react-loader-spinner";
class CommentUpload extends React.Component {
  constructor(props) {
    super(props);
    this.onImageDropRef = React.createRef();
    this.state = {};
  }

  handleClickOutside = () => {
    if (this.props.onClickOutside) {
      this.props.onClickOutside();
    }
  };

  handleImageRef = () => {
    this.onImageDropRef.current.click();
  };

  onImageDrop = event => {
    let fileLength = event.target.files.length;
    let pictures = [];
    for (var i = 0; i < fileLength; i++) {
      pictures.push(event.target.files[i]);
    }
    this.props.updateUploadedState(pictures);
  };

  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (this.props.handleInputChange) {
      this.props.handleInputChange(e);
    }
  };

  render() {
    const { props } = this;
    return (
      <>
        <div className="">
          <div className="comment-container">
            <textarea
              name={`${this.props.commentName}`}
              value={this.props.comments ? this.props.comments : ""}
              onClick={this.props.showCommentBox}
              onChange={e => this.props.handleInputChange(e)}
              className="form-control"
              rows="1"
              placeholder="Write Here..."
            />
            <div className="uploded-img">
              {this.props.showBox
                ? this.props.state.pictures.map((file, idx) => {
                    return (
                      <div className="img-container">
                        <img
                          src={`${URL.createObjectURL(file)}`}
                          // onClick={() => this.openViewImage(attachment.imge_url)}
                          height="42"
                          width="42"
                          style={{ cursor: "pointer" }}
                        ></img>
                        <span
                          className="close-icon"
                          onClick={() => this.props.removeUploadedImage(idx)}
                        >
                          <i className="fa fa-close"></i>
                        </span>
                      </div>
                    );
                  })
                : null}
            </div>
            <input
              ref={this.onImageDropRef}
              type="file"
              className="hide"
              onChange={this.onImageDrop}
              name="uploadedfile"
              multiple
            ></input>
            <div
              className={`${
                this.props.showBox ? "show" : "hide"
              } comment-action`}
            >
              <div
                className={`${
                  !this.props.showSave && !this.props.showAttachIcon
                    ? "hide"
                    : "show"
                }`}
              >
                <span className="upload-files" onClick={this.handleImageRef}>
                  <i className="fas fa-paperclip"></i>
                </span>
                <button
                  className={`btn save-button ${
                    this.props.state.taskloader
                      ? "disabled"
                      : this.props.comments
                      ? ""
                      : "disabled"
                  }`}
                  onClick={this.props.save}
                  type="button"
                >
                  Save
                  {this.props.state.taskloader ? (
                    <Loader
                      type="Oval"
                      color="#33a1ff"
                      height={20}
                      width={20}
                      style={{ paddingLeft: "15px" }}
                      className="d-inline-block login-signup-loader"
                    />
                  ) : null}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default onClickOutside(CommentUpload);

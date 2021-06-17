import React, { Component } from "react";
import ImageUploader from "react-images-upload";
import onClickOutside from "react-onclickoutside";
import Loader from "react-loader-spinner";
import ReactTooltip from "react-tooltip";
import PropTypes from 'prop-types';
import { propTypes } from "react-bootstrap/esm/Image";


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

  onImageDrop = (event) => {
    let fileLength = event.target.files.length;
    let pictures = [];
    for (var i = 0; i < fileLength; i++) {
      pictures.push(event.target.files[i]);
    }
    this.props.updateUploadedState(pictures);
  };

  // handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   this.setState({ [name]: value });
  //   if (this.props.handleInputChange) {
  //     this.props.handleInputChange(e);
  //   }
  // };

  isImage = (name) => {
    let nameSplit = name.split(".");
    return ["png", "jpeg", "jpg"].includes(nameSplit[nameSplit.length - 1]);
  };
  onEnterPress = (e) => {

    if (e.keyCode == 13 && e.shiftKey == false) {

      // if (e.target.value !== "") {
      //   this.props.save();
      // }
      this.props.save();
    }

  }

  render() {
    const { props } = this;
    return (
      <>
        <div className="">
          <div className="comment-container">
            <div className="cmnt-input-div">
              <div className="cmnt-input-div-sub1">
                <textarea
                  name={`${this.props.commentName}`}
                  value={this.props.comments ? this.props.comments : ""}
                  onClick={this.props.showCommentBox}
                  onChange={(e) => this.props.handleInputChange(e)}
                  onKeyDown={this.onEnterPress}
                  className="comment-input"
                  rows="auto"
                  style={{ paddingTop: "0px", paddingBottom: "0px" }}
                  placeholder="Write a comment..."
                />
              </div>
              <div className="cmnt-input-div-sub2">
                <input
                  ref={this.onImageDropRef}
                  type="file"
                  className="hide"
                  onChange={this.onImageDrop}
                  name="uploadedfile"
                  accept=".csv, .jpg, .png, .jpeg, .pdf, .doc, .docx"
                  multiple
                ></input>
                <span className="upload-files" onClick={this.handleImageRef}>
                  <i className="fas fa-paperclip  d-inline-block" data-tip data-for="registerTip7"
                    data-background-color="#f0f2f5"
                    data-text-color="#010101">
                    {/* <span className="tooltiptext-pwd7">
                      (suport: .csv, .jpg, .png, .jpeg, .pdf, .doc, .docx)
                </span> */}
                  </i>

                  <ReactTooltip id="registerTip7" place="top" effect="solid">
                    suport: .csv, .jpg, .png, .jpeg, .pdf, .doc, .docx
                      </ReactTooltip>
                </span>
              </div>
            </div>

            <div className="uploded-img">
              {this.props.showBox
                ? this.props.pictures && this.props.pictures.map((file, idx) => {
                  return (
                    <>
                      {this.isImage(file.name) ? (
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
                            onClick={() =>
                              this.props.removeUploadedImage(idx)
                            }
                          >
                            <i className="fa fa-close"></i>
                          </span>
                          <div className="img-name">{file.name}</div>
                        </div>
                      ) : (
                          <>
                            <a
                              href="#"
                              style={{
                                fontSize: "12px",
                                padding: "12px",
                                // color: "#d3e5f5",

                              }}
                            >
                              {file.name}
                            </a>
                            <span
                              className="close-icon center-icon"
                              onClick={() =>
                                this.props.removeUploadedImage(idx)
                              }
                            >
                              <i className="fa fa-close"></i>
                            </span>
                          </>
                        )}
                    </>
                  );
                })
                : null}
            </div>
            {/* <input
              ref={this.onImageDropRef}
              type="file"
              className="hide"
              onChange={this.onImageDrop}
              name="uploadedfile"
              accept=".csv, .jpg, .png, .jpeg, .pdf, .doc, .docx"
              multiple
            ></input>
            <span className="upload-files" onClick={this.handleImageRef}>
              <i className="fas fa-paperclip tooltip-pwd7 d-inline-block">
                <span className="tooltiptext-pwd7">
                  (suport: .csv, .jpg, .png, .jpeg, .pdf, .doc, .docx)
                </span>
              </i>
            </span> */}
            <div
              className={`${this.props.showBox ? "show" : "hide"
                } comment-action`}
            >
              <div
                className={`${!this.props.showSave && !this.props.showAttachIcon
                  ? "hide"
                  : "show"
                  }`}
              >
                {/* <span className="suport">
                  (suport: .csv, .jpg, .png, .jpeg, .pdf, .doc, .docx)
                </span> */}


                {/* <button
                  className={`btn save-button ${
                    this.props.state.taskloader
                      ? "disabled"
                      : this.props.comments ||
                        this.props.state.pictures.length > 0
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
                </button> */}
              </div>
            </div>
            {/* </form> */}

          </div>
          {/* <div className="" style={{ float: "right", margin: "4px 0px" }}>
            <button
              className={`btn save-button ${
                this.props.state.taskloader
                  ? "disabled"
                  : this.props.comments ||
                    this.props.state.pictures.length > 0
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
          </div> */}
        </div>
      </>
    );
  }
}

CommentUpload.propTypes = {
  state: PropTypes.object.isRequired,
  showSave: PropTypes.bool.isRequired,
  showAttachIcon: PropTypes.bool.isRequired,
  comments: PropTypes.string,
  commentName: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  save: PropTypes.func,
  pictures: PropTypes.array,
  showBox: PropTypes.bool,
  updateUploadedState: PropTypes.func,
  removeUploadedImage: PropTypes.func,
}


export default onClickOutside(CommentUpload);

import React, { Component } from "react";
import ImageUploader from "react-images-upload";
import onClickOutside from "react-onclickoutside";

class CommentUpload extends React.Component {
  constructor(props) {
    super(props);
    this.onImageDropRef = React.createRef();
    this.state = {
      comments: "",
      showBox: false,
      pictures: []
    };
  }

  componentDidMount = () => {
    if (this.props.defaultComments) {
      this.setState({ comments: this.props.defaultComments });
    }
    if (this.props.showBox) {
      this.setState({ showBox: true });
    }
  };

  handleClickOutside = () => {
    this.setState({ showBox: false });
    if (this.props.onClickOutside) {
      this.props.onClickOutside();
    }
  };

  handleImageRef = () => {
    this.onImageDropRef.current.inputElement.click();
  };

  onImageDrop = pictures => {
    this.setState({
      pictures: pictures
    });
  };

  showCommentBox = () => {
    this.setState({ showBox: true });
  };

  onSave = () => {
    this.props.save(this.state.comments, this.state.pictures);
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
              name="comments"
              value={this.state.comments}
              onClick={this.showCommentBox}
              onChange={e => this.handleInputChange(e)}
              className="form-control"
              rows="1"
              placeholder="Write Here..."
            />
            <ImageUploader
              className={`${this.state.showBox ? "show" : "hide"}`}
              ref={this.onImageDropRef}
              withIcon={false}
              withPreview={true}
              withLabel={false}
              buttonText=""
              fileContainerStyle={{}}
              onChange={this.onImageDrop}
              imgExtension={[".jpg", ".jpeg", ".gif", ".png", ".gif"]}
              maxFileSize={5242880}
            />
            <div
              className={`${this.state.showBox ? "show" : "hide"}`}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                className={`${
                  !this.props.showSave && !this.props.showAttachIcon
                    ? "hide"
                    : "show"
                }`}
              >
                <button
                  className={`btn save-button ${
                    this.state.comments ? "" : "disabled"
                  }`}
                  onClick={this.onSave}
                  type="button"
                >
                  Save
                </button>
                <span className="upload-files" onClick={this.handleImageRef}>
                  <i class="fas fa-paperclip"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default onClickOutside(CommentUpload);

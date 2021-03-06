class BorrowBook extends React.Component{
    constructor(props){
        super(props);
        this.rootRef = React.createRef();
        this.borrowButton = React.createRef();
        this.returnButton = React.createRef();

        if (this.props.data.book && typeof this.props.data.book.id!='undefined'){
            this.state={
              book: this.props.data.book,
              images: this.props.data.book.images,
              cover: this.props.data.book.cover
            };
        }else{
            this.state={
              book: null,
              images: [],
              cover: null
            };
        }
        
        this.getCoverUrl=this.getCoverUrl.bind(this);
        this.borrow=this.borrow.bind(this);
        this.return=this.return.bind(this);
    }

    getCoverUrl(coverId){
      var img=this.state.images.find(function(img){ return img.id==coverId});
      if (typeof img=='undefined'){
        return this.props.noImage;
      }else{
        return img.name.url;
      }
    }  

    /*shouldComponentUpdate(nextProps){
        if (this.props.data.id!=nextProps.data.id || this.props.data.title!=nextProps.data.title || this.props.data.description!=nextProps.data.description ){
            return true
        }else{
            return false;
        }
    }*/

    componentWillReceiveProps(someProps) {
    }    

    componentDidMount(){
      var self=this;
      if (this.newBook){
        $(this.saveButton.current).prop('disabled', true);
        var self=this;
        global.fetch(APIUrls['Book'], 'POST', {}, {
          callbackSuccess:function(response){
            self.newBook=false;
            self.setState({book: response.data, images: [], cover: null});
          },
          callbackFailure:function(){

          },
          callbackError:function(){

          }
        });
      }
    }

    borrow(){
        $(this.borrowButton.current).prop('disabled', true);
        var url=APIUrls['BorrowBook']+'/'+this.state.book.id;
        var method='PUT';
        var data={};
        
        var self=this;
        global.fetch(url, method, data, {
          callbackSuccess:function(){
            global.app.notify('success','','Book succesfully borrowed');
            $(self.borrowButton.current).prop('disabled', false);            
            self.props.changeComponent('BorrowList',{mine: false});
          },
          callbackFailure:function(){
            $(self.borrowButton.current).prop('disabled', false);
          },
          callbackError:function(){
            $(self.borrowButton.current).prop('disabled', false); 
          }
        });
    }
    
    return(){
        $(this.returnButton.current).prop('disabled', true);
        var url=APIUrls['ReturnBook']+'/'+this.state.book.id;
        var method='PUT';
        var data={};
        
        var self=this;
        global.fetch(url, method, data, {
          callbackSuccess:function(){
            global.app.notify('success','','Book succesfully returned');
            $(self.borrowButton.current).prop('disabled', false);            
            self.props.changeComponent('BorrowList',{mine: false});
          },
          callbackFailure:function(){
            $(self.borrowButton.current).prop('disabled', false);
          },
          callbackError:function(){
            $(self.borrowButton.current).prop('disabled', false); 
          }
        });
    }
    
    render(){
        return(
          <div className="center-panel">
            <div className="panel child-panel" ref={ this.rootRef }>
              <h3>Borrow book</h3>
              <form>
                  <div className="field">
                    <div className="uploader" >
                      <FilePreview existing={ this.getCoverUrl(this.state.cover) } onlyView={ true } ></FilePreview>
                    </div>
                  </div>

                  <div className="field">
                      <label>Title</label><br/>
                      <input className="form-control" id="title" type="text" maxLength="100" defaultValue={ this.state.book.title } disabled='true' />
                  </div>
                  <div className="field">
                      <label>Author</label><br/>
                      <input className="form-control typeahead" id="author" type="text" defaultValue={ this.state.book.author } disabled='true'/>
                  </div>

                  <div className="field">
                      <label>Description</label><br/>
                      <textarea className="form-control" id="description" defaultValue={ this.state.book.description } maxLength="1000" disabled='true'>
                      </textarea>
                  </div>
                  { this.props.data.book.available==0 ?
                  "There are no more copies available." : null }
                  <hr/>
                  <div className="actions">
                      <input value="Cancel" className="btn btn-primary pull-left" type="button" onClick={ this.props.cancel } />
                      { this.props.data.book.givenTaken==true ? 
                        <input value="Return" className="btn btn-primary pull-right" type="button" onClick={ this.return } ref={ this.returnButton }/>
                      :
                        this.props.data.book.available>0 ?
                          <input value="Borrow" className="btn btn-primary pull-right" type="button" onClick={ this.borrow } ref={ this.borrowButton }/>
                        : 
                          null
                      }
                  </div>
              </form>
              <div className="clearfix"></div>
            </div>
            
            <div className="panel child-panel">
              <h3>Images</h3>
                <form>
                  <div className="field">
                    <ImageGallery images={ this.state.images } cover={ null } />
                  </div>
                </form>
                <div className="clearfix"></div>
            </div>
          </div>
        );
    }    
}
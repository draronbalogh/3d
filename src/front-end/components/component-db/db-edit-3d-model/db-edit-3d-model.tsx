import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios, { AxiosResponse } from 'axios';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { isVariableDeclaration, NumericLiteral } from 'typescript';
import { v4 as uuid } from 'uuid';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { _CONFIG } from '../../../../_config/_config';
import { modelConfig } from '../../../../_config/config-model';
interface Model3dState {
  id: number | undefined;
  data: any;
  files: any;
  isSaved: boolean;
  oldFilesToDel: any;
}
declare module 'react' {
  interface HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}
export class DbEdit3dModel extends React.Component<any, any> {
  static imgArray: any[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      id: Number(window.location.pathname.split('/').pop()),
      isSaved: false,
      data: this.props.data,
      files: { modelUrl: [], modelImgs: [], modelMaterialUrl: [] },
      oldFilesToDel: null
    };
    // console.log(' this.props.data', this.props.data);
  }

  componentDidMount(): void {
    const { data } = this.state;
    if (data.length >= 1) this.findDataById();
    if (!data.length) this.fetchModelDataById();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.setState({ data: this.props.data });
    }
    if (JSON.stringify(this.props.files) !== JSON.stringify(prevProps.files)) {
      this.setState({ files: this.props.files });
    }
  }
  findDataById = () => {
    const { data, id } = this.state;
    let obj = data.find((o: { id: any }) => o.id === id);
    this.setState({ data: obj });
    this.setState({ oldFilesToDel: obj });
  };
  fetchModelDataById = async () => {
    console.log('fetichng');
    try {
      const { id } = this.state;
      const response = await axios.get(_CONFIG.url.getModel + id);
      this.setState({ data: response.data });
      this.setState({ oldFilesToDel: response.data });
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
    }
  };
  inputFileDataUpdater = async (elm: string, e: any) => {
    try {
      const { oldFilesToDel } = this.state;
      console.log('oldFilesToDel', oldFilesToDel);
      console.log('elm', elm);
      let modelUrl = oldFilesToDel['modelUrl'] ? oldFilesToDel['modelUrl'] : '';
      let modelImgs = oldFilesToDel['modelImgs'];
      let modelMaterialUrl = oldFilesToDel['modelMaterialUrl'] ? oldFilesToDel['modelMaterialUrl'] : '';

      let modelUrlA = modelUrl.split(',');
      let modelImgsA = modelImgs.split(',');
      let modelMaterialUrlA = modelMaterialUrl.split(',');
      console.log('modelUrlA', modelUrlA);
      console.log('modelImgsA', modelImgsA);
      console.log('modelmodelMaterialUrlAUrlA', modelMaterialUrlA);

      let t: any[] = [];
      if (elm === 'modelUrl') DbEdit3dModel.imgArray.push(modelUrlA);
      if (elm === 'modelImgs') DbEdit3dModel.imgArray.push(modelImgsA);
      if (elm === 'modelMaterialUrl') DbEdit3dModel.imgArray.push(modelMaterialUrlA);
      console.log(' DbEdit3dModel.imgArray', DbEdit3dModel.imgArray.flat(1));

      // todo : a feile-okat már törli, de ki kell törölni a mysql-ből is, mert így a file eltűnik, de
      // ha mégse fejezi be, akkor a file eltűnit, de a mysql file név ott maradt..
      // vagy ha már cserélt, akkor nem mehet el az oldalról, hanem mentenie kell..
      /*
      let t: any[] = [];
      if (elm === 'modelUrl') t.push(modelUrl);
      if (elm === 'modelImgs') t.push(modelImgs);
      if (elm === 'modelMaterialUrl') t.push(modelMaterialUrl);
      console.log('t :>> ', t);
      let str = '';
      t.forEach((x) => {
        str.concat(x);
      });
      console.log('str :>> ', str);*/

      this.setState({
        deleteTheseFiles: DbEdit3dModel.imgArray.flat(1)
      });

      let files = { ...this.state.files };
      files[elm] = e.target.files;
      this.setState({ files });
      let filesTxt = '';
      let x = 0;
      for (const i of e.target.files) {
        const fileName = i.name;
        // filesTxt += `${uuid()}-${fileName},`;
        filesTxt += `${uuid()}-${fileName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-zA-Z0-9.]/g, '-')},`;
      }
      // console.log('this.sate.files :>> ', this.state);

      this.setState(
        {
          data: {
            ...this.state.data,
            [elm]: filesTxt.slice(0, -1) // comma separated list of files as mysql record
          }
        },
        () => {
          //   console.log('this.state.data', this.state.data);
          // console.log('this.state', this.state);
        }
      );

      this.setState({ isSaved: false });
    } catch (error) {}
  };
  inputDataUpdater = (elm: string, e: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [elm]: e
      }
    });

    this.setState({ isSaved: false });
  };
  update3dModel = async (e: any) => {
    try {
      e.preventDefault();
      const { data, deleteTheseFiles } = this.state;
      console.log('updateupdateupdateupdate deleteTheseFiles', deleteTheseFiles);
      try {
        DbEdit3dModel.imgArray = [];
        await axios.post(_CONFIG.url.deleteFiles, { deleteTheseFiles }, {}); /*.then((resp: any) => {
          this.setState({
            deleteTheseFiles: []
          });
        });*/
        //   let removable = elm === 'modelImgs' ? modelImgs : elm === 'modelMaterialUrl' ? modelMaterialUrl : modelUrl;
        //     let imgArray = [...removable];
      } catch (e: any) {
        const statusCode = e.response.status; // 400
        const statusText = e.response.statusText; // Bad Request
        const message = e.response.data.message[0]; // id should not be empty
        console.log(`${statusCode} - ${statusText} - ${message}`);
      } finally {
      }

      const { id, files } = this.state;

      const filesData = new FormData();
      for (const file in files) {
        Object.values(files[file]).forEach((individualFile, index) => {
          //          console.log('index :>> ', index);
          //   console.log('file-->', file);
          //    console.log(' data.file', data[file]);
          const nameSeparatedByComma = data[file].split(',')[index];
          if (individualFile) filesData.append('file', individualFile as Blob, nameSeparatedByComma);
        });
      }
      await axios.patch(_CONFIG.url.getModel + id, data);
      await axios.post(_CONFIG.url.uploadFiles, filesData, {});
      this.setState({ isSaved: true });
    } catch (e: any) {
      if (e.response) console.log('Axios Error: ', e.response.data);
    }
  };

  getTitle = (elm: any) => {
    return Object.entries(modelConfig).map(([key, value]) => {
      if (value.name === elm) return value.label;
    });
  };

  switcher = (elm: any, trgVal: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [elm]: trgVal
      }
    });
    return trgVal;
  };
  newFunction = (category: any) => {
    //console.log('category', category);
    return Array.isArray(category)
      ? category.map((element: any, x: number) => (
          <option key={x} value={element}>
            {element}
          </option>
        ))
      : null;
  };
  formBuilder = (i: number, elm: string) => {
    let { data } = this.state,
      element = data[elm],
      ctr = modelConfig[i].control,
      category = modelConfig[i].categories,
      isRequired = modelConfig[i].isRequired,
      label = modelConfig[i].label;

    switch (ctr) {
      case 'switch':
        return <Form.Check type={'switch'} id={`ctr${i}`} label={label} defaultChecked={element} onChange={(e) => this.switcher(elm, e.target.checked)} />;
      case 'select':
        return (
          <Form.Select onChange={(e) => this.inputDataUpdater(elm, e.target.value)} value={element ? element : ''}>
            <>
              {
                // TODO:: itt kéne valami setTimeout
              }
              {this.newFunction(category)}
            </>
          </Form.Select>
        );
      case 'file':
        //@ts-ignore
        return <Form.Control multiple type={ctr} name='imageName' onChange={(e) => this.inputFileDataUpdater(elm, e)}></Form.Control>;
      case 'textarea':
        return <Form.Control as={ctr} rows={3} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)}></Form.Control>;
      default:
        return <Form.Control type={ctr} value={element ? element : ''} onChange={(e) => this.inputDataUpdater(elm, e.target.value)} required={isRequired}></Form.Control>;
    }
  };

  render() {
    const { data, isSaved } = this.state;
    // console.log('data :>> ', typeof data);
    return (
      <Form onSubmit={this.update3dModel}>
        {data
          ? Object.keys(data)?.map((elm: any, i: number) => {
              let ctr = modelConfig[i]?.control,
                enableForAddEdit = modelConfig[i]?.enableForAddEdit;
              return enableForAddEdit ? (
                <Form.Group className={ctr !== 'hidden' ? 'm-1' : 'd-none'} key={i}>
                  {ctr !== 'switch' ? <Form.Label>{this.getTitle(elm)}</Form.Label> : null}
                  {this.formBuilder(i, elm)}
                </Form.Group>
              ) : null;
            })
          : null}
        <div className='field'>
          {!isSaved ? (
            <Button variant='primary' type='submit'>
              Mentés
            </Button>
          ) : (
            <Navigate to='/' />
          )}
        </div>
      </Form>
    );
  }
}

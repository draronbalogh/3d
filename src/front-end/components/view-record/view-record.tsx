//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
///////////////////////////////////////////////////////////   CONFIG
import { HOST3D, _CONFIG } from '../../../_config/config-general';
import { recordConfig } from '../../../_config/config-records';
///////////////////////////////////////////////////////////   LIBS
import axios from 'axios';
import { logAxiosError } from '../../../assets/gen-methods';
///////////////////////////////////////////////////////////   INTERFACE
interface CompProps {
  data: any;
}
interface CompState {
  data: any;
  recordId: number | any;
  imageBlob: Blob | null;
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class ViewRecord extends React.Component<CompProps, CompState> {
  constructor(props: CompProps) {
    super(props);
    this.state = {
      recordId: Number(window.location.pathname.split('/').pop()),
      data: this.props.data,
      imageBlob: null
    };
  }

  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount() {
    const { data } = this.state;
    if (data.length >= 1) this.findDataById();
    if (!data.length) {
      this.fetchModelDataById();
    }
  }

  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Find data by recordId
   */
  findDataById = () => {
    const { data, recordId } = this.state;
    const obj = data.find((o: { recordId: any }) => o.recordId === recordId);
    this.setState({ data: obj }, () => {
      console.log('most töltöm be');
      this.loadImage();
    });
  };

  /**
   * Fetch data by recordId
   */
  fetchModelDataById = async () => {
    console.log('?????????');
    try {
      const { recordId } = this.state;
      const response = await axios.get(_CONFIG.url.recordApi + recordId);
      this.setState({ data: response.data }, () => {
        console.log('most töltöm be');
        this.loadImage();
      });
    } catch (e: any) {
      logAxiosError(e, _CONFIG.msg.error.fetch.getData);
    }
  };

  ///////////////////////////////////////////////////////////   RENDER METHODS
  /**
   * Print model description
   * @returns data or null
   */
  printModelDesc = () => {
    const { data } = this.state;
    return data
      ? Object.keys(data)?.map((elm: any, i: number) => {
          return <td key={i}>{typeof data[elm] !== 'object' ? data[elm] : ''}</td>;
        })
      : null;
  };

  /**
   * Get title
   * @returns label list of table cells
   */
  getTitle = () => {
    return Object.entries(recordConfig).map(([key, value]) => {
      return <td key={key}>{value.label}</td>;
    });
  };
  loadImage = () => {
    const { data } = this.state;
    if (data && data.recordImgs) {
      axios
        .get(`${HOST3D}/uploads/${data.recordUuid}/${data.recordImgs}`, {
          responseType: 'blob'
        })
        .then((response) => {
          console.log('1');
          const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
          console.log('imageBlob', imageBlob);
          this.setState({ imageBlob });
        })
        .catch((error) => {
          logAxiosError(error, 'Error loading image');
        });
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////    RENDER
  render() {
    const { recordId, data, imageBlob } = this.state;

    console.log('data', data);
    return (
      <table>
        <thead>
          <tr>
            <th>3d component ({recordId})</th>
          </tr>
          <tr>{this.getTitle()}</tr>
        </thead>
        <tbody>
          <tr>{this.printModelDesc()}</tr>
          {imageBlob && <img src={URL.createObjectURL(imageBlob)} alt='Kép' />}
        </tbody>
      </table>
    );
  }
}

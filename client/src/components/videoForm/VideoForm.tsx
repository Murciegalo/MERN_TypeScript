import React, {ChangeEvent, useState, useEffect} from 'react'
import { FormEvent } from 'react'
import {Params, Video} from '../Interface/interface'
import {toast} from 'react-toastify'
import * as videoService from '../services/Video.services'
import {useHistory, useParams} from 'react-router-dom'

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

const VideoForm = () => {
  const initState =  {
    title: "",
    url: "",
    description: ""
  }
  const [video, setVideo] = useState<Video>(initState)
  const history = useHistory()
  const params = useParams<Params>()

  const getVideo = async (id:string) => {
    const res = await videoService.getVideo(id)
    const {title, description, url } = res
    setVideo({title, description, url})
  }

  useEffect(() => {
    if(params.id){
      getVideo(params.id)
    }
  }, [params.id])

  const handleChange = (e:InputChange) => {
    setVideo({
      ...video,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!params.id){
      await videoService.createVideo(video)
      toast.success('New video added')
      setVideo(initState)
    }
    else{
      console.log('UPDATING');
      await videoService.updateVideo(params.id, video)
      toast.success('Updated video')
      setVideo(initState)
    }
    history.push('/')    
  } 

  const btn = <button 
    className={`${params.id ? 'btn btn-info center' : 'btn btn-primary center'}`}
    style={{marginLeft: '10px'}}
  >
    {params.id ? 'Update Video' : 'Create Video'}
  </button>
  
  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="card">
          <div className="card-body">
            <h3>New Video</h3>
            <form onSubmit={handleSubmit}>
              <div style={{margin: '20px 10px'}}>
                <input
                  onChange={handleChange}
                  type="text"
                  name="title"
                  value={video.title}
                  placeholder="Please input a title"
                  className="form-control"
                  autoFocus
                />
              </div>
              <div style={{margin: '20px 10px'}}>
                <input
                  onChange={handleChange}
                  type="text"
                  name="url"
                  value={video.url}
                  placeholder="...someWeb.com"
                  className="form-control"
                />
              </div>
              <div style={{margin: '20px 10px'}}>
                <textarea
                  onChange={handleChange}
                  name="Description"
                  rows={3}
                  className="form-control"
                ></textarea>
              </div>
              {btn}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default VideoForm;
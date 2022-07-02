import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { getAuth } from 'firebase/auth';
import editIcon from '../assets/svg/editIcon.svg';
import styled from 'styled-components';

const ExploreHeading = styled.p`
  font-weight: 700;
`;

const EditIconDiv = styled.div`
  cursor: pointer;
  position: fixed;
  top: 3%;
  right: 1%;
  z-index: 2;
  background-color: #ffffff;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SwiperSlideText = styled.p`
  color: #ffffff;
  position: absolute;
  top: 70px;
  left: 0;
  font-weight: 600;
  max-width: 90%;
  font-size: 1.25rem;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0.5rem;

  @media (min-width: 1024px) {
    font-size: 1.75rem;
  }
`;

const SwiperSlideButton = styled.p`
  color: #000000;
  position: absolute;
  top: 143px;
  left: 11px;
  font-weight: 600;
  max-width: 90%;
  background-color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  cursor: pointer;
  }
  @media (min-width: 1024px) {
    font-size: 1.25rem;
  }
`;

export default function Slider() {
  const [news, setNews] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const newsRef = collection(db, 'news');

      const q = query(newsRef, orderBy('timestamp', 'desc'));

      const querySnap = await getDocs(q);

      let news = [];

      querySnap.forEach((doc) => {
        return news.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setNews(news);
    };
    fetchNews();
  }, []);

  return (
    news && (
      <>
        <ExploreHeading>News</ExploreHeading>

        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          slidesPerView={1}
          pagination
          navigation
        >
          {news.map(({ data, id }) => (
            <SwiperSlide key={id}>
              {auth.currentUser &&
                auth.currentUser.metadata.createdAt === '1656428823385' && (
                  <EditIconDiv
                    onClick={() => {
                      navigate(`/edit-news/${id}`);
                    }}
                  >
                    <img src={editIcon} alt='' />
                  </EditIconDiv>
                )}
              <div
                style={{
                  backgroundImage: `url(${data.imgUrl})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
                className='swiper-slide'
              >
                <SwiperSlideText>{data.name}</SwiperSlideText>

                {data.description ? (
                  <SwiperSlideButton onClick={() => navigate(`/${data.slug}`)}>
                    More
                  </SwiperSlideButton>
                ) : (
                  <></>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

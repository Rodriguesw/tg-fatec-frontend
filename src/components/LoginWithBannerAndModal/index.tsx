import * as S from './styles'

interface LoginWithBannerAndModalProps {
    backgroundImage?: string;
}

export function LoginWithBannerAndModal ({backgroundImage}: LoginWithBannerAndModalProps) {
    return (
        <S.Container backgroundImage={backgroundImage}>   
            <S.Logo>
                <img src="/images/logo/logo-playfut-white.svg"></img>
            </S.Logo>

            

            {/* <S.Modal>
                
            </S.Modal> */}

        </S.Container>
    )
}
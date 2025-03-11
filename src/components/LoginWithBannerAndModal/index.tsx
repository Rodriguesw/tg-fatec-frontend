import * as S from './styles'

interface LoginWithBannerAndModalProps {
    backgroundImage?: string;
    children: React.ReactNode;
    minHeight?: string;
}

export function LoginWithBannerAndModal ({backgroundImage, children, minHeight}: LoginWithBannerAndModalProps) {
    return (
        <S.Container>   
            <S.Logo backgroundImage={backgroundImage} minHeight={minHeight}>
                <img src="/images/logo/logo-playfut-white-fina.svg"></img>
            </S.Logo>

            <S.Box>
                {children}
            </S.Box>    
        </S.Container>
    )
}
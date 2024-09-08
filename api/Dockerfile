FROM surnet/alpine-wkhtmltopdf:3.15.0-0.12.6-full AS wkhtmltopdf
FROM python:3.10.12-alpine3.18

# RUN apk add --no-cache \
#     libstdc++=10.3.1_git20211027-r0 \
#     libx11=1.7.3.1-r1 \
#     libxrender=0.9.10-r3 \
#     libxext=1.3.4-r0 \
#     libssl1.1=1.1.1q-r0 \
#     ca-certificates=20220614-r0 \
#     fontconfig=2.13.1-r4 \
#     freetype=2.11.1-r2 \
#     ttf-droid=20200215-r1 \
#     ttf-freefont=20120503-r2 \
#     ttf-liberation=2.00.5-r0 \
#     build-base=0.5-r3 \
#     ;
# wkhtmltopdf copy bins from ext image
COPY --from=wkhtmltopdf /bin/wkhtmltopdf /bin/libwkhtmltox.so /bin/

WORKDIR /var/www/app

COPY ./requirements.txt .
RUN pip install  --no-cache-dir -r requirements.txt \
    # Create a non-root user to run the application
    && adduser -D nonroot
USER nonroot

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
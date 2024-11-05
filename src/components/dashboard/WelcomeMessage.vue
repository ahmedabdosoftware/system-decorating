<template>
    <div class="welcomeMessage">
        <p>
         ! مرحبا يا احمد 
        </p>
      </div>
</template>
<style scoped lang="scss">

%end_flex{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
%local_paragraph{
  font-size: 35px;
  font-weight: 600;
  padding-right: 40px;
  color: rgb(109, 109, 109);

}
.welcomeMessage{
  width: 100%;
  height: 40px;
 // background-color: red;
  @extend  %end_flex;
  p{
    @extend  %local_paragraph;
    // font-family: "Aref Ruqaa", serif;
    // font-weight: 400;
    // font-style: normal;
    // font-family: "Rakkas", serif;
    // font-weight: 400;
    // font-style: normal;
    // font-family: "Rakkas", serif;
    // font-weight: 400;
    // font-style: normal;
    font-family: "Lateef", serif;
    font-weight: 700;
    font-style: normal;
  }

}

</style>